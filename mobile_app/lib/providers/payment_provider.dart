import 'package:flutter/material.dart';
import '../models/category_model.dart';
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
  List<CategoryModel> _categories = [];
  bool _isLoading = false;
  bool _isLoadingCategories = false;
  String? _errorMessage;

  int get currentStep => _currentStep;
  FineModel? get verifiedFine => _verifiedFine;
  PaymentModel? get paymentReceipt => _paymentReceipt;
  List<CategoryModel> get categories => _categories;
  bool get isLoading => _isLoading;
  bool get isLoadingCategories => _isLoadingCategories;
  String? get errorMessage => _errorMessage;

  Future<void> loadCategories() async {
    if (_categories.isNotEmpty) return;

    _isLoadingCategories = true;
    notifyListeners();

    try {
      _categories = await _fineService.getCategories();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoadingCategories = false;
      notifyListeners();
    }
  }

  Future<bool> verifyFine(String referenceNumber, String categoryIdentifier) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _verifiedFine = await _fineService.verifyFine(
        referenceNumber,
        categoryIdentifier,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceFirst('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  void nextStep() {
    if (_currentStep < 2) {
      _currentStep++;
      notifyListeners();
    }
  }

  void previousStep() {
    if (_currentStep > 0) {
      _currentStep--;
      notifyListeners();
    }
  }

  Future<bool> processPayment({
    required String paymentMethod,
    String? cardNumber,
    String? cardHolderName,
    String? cardExpiry,
    String? cardCvv,
    String? payerName,
    String? payerContact,
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
        referenceNumber: _verifiedFine!.referenceNumber,
        categoryIdentifier: _verifiedFine!.categoryIdentifier,
        paymentMethod: paymentMethod,
        cardNumber: cardNumber,
        cardHolderName: cardHolderName,
        cardExpiry: cardExpiry,
        cardCvv: cardCvv,
        payerName: payerName,
        payerContact: payerContact,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceFirst('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  void reset() {
    _currentStep = 0;
    _verifiedFine = null;
    _paymentReceipt = null;
    _isLoading = false;
    _errorMessage = null;
    notifyListeners();
  }
}
