import 'package:dio/dio.dart';
import '../models/category_model.dart';
import '../models/fine_model.dart';
import 'api_client.dart';

class FineService {
  final ApiClient _apiClient = ApiClient();

  Future<FineModel> verifyFine(
    String referenceNumber,
    String categoryIdentifier,
  ) async {
    try {
      final response = await _apiClient.post(
        '/fines/verify',
        {
          'referenceNumber': referenceNumber,
          'categoryIdentifier': categoryIdentifier,
        },
      );

      if (response.statusCode == 200) {
        return FineModel.fromJson(response.data);
      } else {
        throw Exception('Fine not found: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception(ApiClient.extractErrorMessage(e));
    }
  }

  Future<FineModel> getFineByReferenceNumber(String referenceNumber) async {
    try {
      final response = await _apiClient.get('/fines/$referenceNumber');

      if (response.statusCode == 200) {
        return FineModel.fromJson(response.data);
      } else {
        throw Exception('Fine not found: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception(ApiClient.extractErrorMessage(e));
    }
  }

  Future<List<CategoryModel>> getCategories() async {
    try {
      final response = await _apiClient.get('/categories');

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data
            .map((json) => CategoryModel.fromJson(json))
            .where((c) => c.active)
            .toList();
      } else {
        throw Exception('Error fetching categories: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception(ApiClient.extractErrorMessage(e));
    }
  }
}
