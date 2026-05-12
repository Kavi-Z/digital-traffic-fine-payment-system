import 'package:dio/dio.dart';
import '../models/fine_model.dart';
import 'api_client.dart';

class FineService {
  final ApiClient _apiClient = ApiClient();

  Future<FineModel> getFineByReference(
    String referenceNumber,
    String categoryIdentifier,
  ) async {
    try {
      final response = await _apiClient.get(
        '/fines/lookup',
        queryParameters: {
          'referenceNumber': referenceNumber,
          'categoryId': categoryIdentifier,
        },
      );

      if (response.statusCode == 200) {
        return FineModel.fromJson(response.data);
      } else {
        throw Exception('Fine not found: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Error fetching fine: ${e.message}');
    }
  }

  Future<FineModel> getFineById(int id) async {
    try {
      final response = await _apiClient.get('/fines/$id');

      if (response.statusCode == 200) {
        return FineModel.fromJson(response.data);
      } else {
        throw Exception('Fine not found: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Error fetching fine: ${e.message}');
    }
  }

  Future<List<FineModel>> getUnpaidFines(String licenseNumber) async {
    try {
      final response = await _apiClient.get(
        '/fines/by-license/$licenseNumber',
        queryParameters: {'status': 'UNPAID'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => FineModel.fromJson(json)).toList();
      } else {
        throw Exception('Error fetching fines: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Error fetching fines: ${e.message}');
    }
  }
}
