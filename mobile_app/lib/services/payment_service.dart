import 'package:dio/dio.dart';
import '../models/payment_model.dart';
import 'api_client.dart';

class PaymentService {
  final ApiClient _apiClient = ApiClient();

  Future<PaymentModel> processPayment({
    required String referenceNumber,
    required String categoryIdentifier,
    required String paymentMethod,
    String? cardNumber,
    String? cardHolderName,
    String? cardExpiry,
    String? cardCvv,
    String? payerName,
    String? payerContact,
  }) async {
    try {
      final paymentData = {
        'referenceNumber': referenceNumber,
        'categoryIdentifier': categoryIdentifier,
        'paymentMethod': paymentMethod,
        if (cardNumber != null) 'cardNumber': cardNumber,
        if (cardHolderName != null) 'cardHolderName': cardHolderName,
        if (cardExpiry != null) 'cardExpiry': cardExpiry,
        if (cardCvv != null) 'cardCvv': cardCvv,
        if (payerName != null) 'payerName': payerName,
        if (payerContact != null) 'payerContact': payerContact,
      };

      final response = await _apiClient.post('/fines/pay', paymentData);

      if (response.statusCode == 200 || response.statusCode == 201) {
        return PaymentModel.fromJson(response.data);
      } else {
        throw Exception('Payment failed: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception(ApiClient.extractErrorMessage(e));
    }
  }
}
