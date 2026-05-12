import 'package:flutter/material.dart';
import '../models/fine_model.dart';
import '../models/payment_model.dart';
import '../services/fine_service.dart';
import '../services/payment_service.dart';

class PaymentProvider extends ChangeNotifier {
  final FineService _fineService = FineService();
  final PaymentService _paymentService = PaymentService();

  int _currentStep = 0;
  FineModel? _verifiedFine;
  PaymentModel? _paymentReceipt;
  bool _isLoading = false;
  String? _errorMessage;

  // Getters
  int get currentStep => _currentStep;
  FineModel? get verifiedFine => _verifiedFine;
  PaymentModel? get paymentReceipt => _paymentReceipt;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  // Step 1: Verify Fine
  Future<bool> verifyFine(String referenceNumber, String categoryIdentifier) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _verifiedFine = await _fineService.getFineByReference(
        referenceNumber,
        categoryIdentifier,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Move to next step
  void nextStep() {
    if (_currentStep < 2) {
      _currentStep++;
      notifyListeners();
    }
  }

  // Move to previous step
  void previousStep() {
    if (_currentStep > 0) {
      _currentStep--;
      notifyListeners();
    }
  }

  // Step 2: Process Payment
  Future<bool> processPayment({
    required double amount,
    required String cardNumber,
    required String cardholderName,
    required String expiryDate,
    required String cvv,
    required String driverPhone,
  }) async {
    if (_verifiedFine == null) {
      _errorMessage = 'No fine verified';
      notifyListeners();
      return false;
    }

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _paymentReceipt = await _paymentService.processPayment(
        fineId: _verifiedFine!.id ?? 0,
        amount: amount,
        cardNumber: cardNumber,
        cardholderName: cardholderName,
        expiryDate: expiryDate,
        cvv: cvv,
        driverPhone: driverPhone,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Reset for new transaction
  void reset() {
    _currentStep = 0;
    _verifiedFine = null;
    _paymentReceipt = null;
    _isLoading = false;
    _errorMessage = null;
    notifyListeners();
  }
}
