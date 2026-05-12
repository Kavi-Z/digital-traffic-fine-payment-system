import 'package:dio/dio.dart';
import '../models/payment_model.dart';
import 'api_client.dart';

class PaymentService {
  final ApiClient _apiClient = ApiClient();

  Future<PaymentModel> processPayment({
    required int fineId,
    required double amount,
    required String cardNumber,
    required String cardholderName,
    required String expiryDate,
    required String cvv,
    required String driverPhone,
  }) async {
    try {
      final paymentData = {
        'fineId': fineId,
        'amount': amount,
        'cardNumber': cardNumber,
        'cardholderName': cardholderName,
        'expiryDate': expiryDate,
        'cvv': cvv,
        'driverPhone': driverPhone,
      };

      final response = await _apiClient.post(
        '/payments',
        paymentData,
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return PaymentModel.fromJson(response.data);
      } else {
        throw Exception('Payment failed: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Payment error: ${e.message}');
    }
  }

  Future<PaymentModel> getPaymentStatus(int paymentId) async {
    try {
      final response = await _apiClient.get('/payments/$paymentId');

      if (response.statusCode == 200) {
        return PaymentModel.fromJson(response.data);
      } else {
        throw Exception('Payment not found: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Error fetching payment: ${e.message}');
    }
  }

  Future<List<PaymentModel>> getPaymentHistory(String driverPhone) async {
    try {
      final response = await _apiClient.get(
        '/payments/history/$driverPhone',
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        return data.map((json) => PaymentModel.fromJson(json)).toList();
      } else {
        throw Exception('Error fetching payments: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Error fetching payments: ${e.message}');
    }
  }
}
