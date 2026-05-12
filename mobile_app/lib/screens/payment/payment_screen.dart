import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../services/fine_service.dart';
import '../../services/payment_service.dart';
import '../../theme/app_theme.dart';
import '../../models/fine_model.dart';

class PaymentScreen extends StatefulWidget {
  final Map<String, dynamic> fineData;

  const PaymentScreen({
    Key? key,
    required this.fineData,
  }) : super(key: key);

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  int _currentStep = 0;
  final _fineService = FineService();
  final _paymentService = PaymentService();

  // Step 1 - Verification
  final _referenceController = TextEditingController();
  final _categoryController = TextEditingController();
  FineModel? _verifiedFine;
  bool _loadingVerification = false;
  String? _verificationError;

  // Step 2 - Payment
  final _nameController = TextEditingController();
  final _cardController = TextEditingController();
  final _expController = TextEditingController();
  final _cvvController = TextEditingController();
  final _phoneController = TextEditingController();
  bool _loadingPayment = false;
  String? _paymentError;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/home'),
        ),
        title: const Text('Pay Traffic Fine'),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [AppTheme.navyDeep, AppTheme.navyMid],
          ),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // Step Indicator
              _buildStepIndicator(),
              const SizedBox(height: 32),

              // Step Content
              if (_currentStep == 0) _buildVerificationStep(),
              if (_currentStep == 1) _buildPaymentStep(),
              if (_currentStep == 2) _buildConfirmationStep(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepIndicator() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildStepCircle(0, 'Verify'),
        Container(
          height: 2,
          width: 40,
          color: _currentStep >= 1 ? AppTheme.goldPrimary : Colors.grey,
        ),
        _buildStepCircle(1, 'Pay'),
        Container(
          height: 2,
          width: 40,
          color: _currentStep >= 2 ? AppTheme.goldPrimary : Colors.grey,
        ),
        _buildStepCircle(2, 'Confirm'),
      ],
    );
  }

  Widget _buildStepCircle(int step, String label) {
    final isActive = _currentStep >= step;
    return Column(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: isActive ? AppTheme.goldPrimary : AppTheme.navyMid,
            shape: BoxShape.circle,
            border: Border.all(color: AppTheme.goldPrimary, width: 2),
          ),
          child: Center(
            child: Text(
              '${step + 1}',
              style: TextStyle(
                color: isActive ? AppTheme.navyDeep : AppTheme.cream,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }

  Widget _buildVerificationStep() {
    return Column(
      children: [
        Text(
          'Fine Verification',
          style: Theme.of(context).textTheme.displaySmall,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 32),
        if (_verifiedFine == null)
          Column(
            children: [
              TextFormField(
                controller: _referenceController,
                decoration: InputDecoration(
                  labelText: 'Fine Reference Number',
                  hintText: 'e.g., TF-2026-00000',
                  prefixIcon: const Icon(Icons.receipt),
                  prefixIconColor: AppTheme.goldPrimary,
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _categoryController,
                decoration: InputDecoration(
                  labelText: 'Category Identifier',
                  hintText: 'A / B / C',
                  prefixIcon: const Icon(Icons.category),
                  prefixIconColor: AppTheme.goldPrimary,
                ),
              ),
              if (_verificationError != null)
                Padding(
                  padding: const EdgeInsets.only(top: 16),
                  child: Text(
                    _verificationError!,
                    style: TextStyle(color: AppTheme.crimson),
                  ),
                ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _loadingVerification ? null : _verifyFine,
                  child: _loadingVerification
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                          ),
                        )
                      : const Text('Verify Fine'),
                ),
              ),
            ],
          )
        else
          Column(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.navyMid.withValues(alpha: 0.7),
                  border: Border.all(color: AppTheme.goldPrimary, width: 2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Fine Details',
                      style: Theme.of(context).textTheme.labelLarge,
                    ),
                    const SizedBox(height: 12),
                    _buildDetailRow('Reference', _verifiedFine!.referenceNumber),
                    _buildDetailRow('Category', _verifiedFine!.categoryIdentifier),
                    _buildDetailRow(
                      'Amount',
                      'LKR ${_verifiedFine!.amount.toStringAsFixed(2)}',
                    ),
                    _buildDetailRow(
                      'License',
                      _verifiedFine!.driverLicenseNumber,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        setState(() {
                          _verifiedFine = null;
                          _referenceController.clear();
                          _categoryController.clear();
                        });
                      },
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        setState(() => _currentStep = 1);
                      },
                      child: const Text('Proceed'),
                    ),
                  ),
                ],
              ),
            ],
          ),
      ],
    );
  }

  Widget _buildPaymentStep() {
    return Column(
      children: [
        Text(
          'Payment Information',
          style: Theme.of(context).textTheme.displaySmall,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 32),
        TextFormField(
          controller: _nameController,
          decoration: InputDecoration(
            labelText: 'Cardholder Name',
            prefixIcon: const Icon(Icons.person),
            prefixIconColor: AppTheme.goldPrimary,
          ),
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _cardController,
          decoration: InputDecoration(
            labelText: 'Card Number',
            hintText: '0000 0000 0000 0000',
            prefixIcon: const Icon(Icons.credit_card),
            prefixIconColor: AppTheme.goldPrimary,
          ),
          keyboardType: TextInputType.number,
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: _expController,
                decoration: InputDecoration(
                  labelText: 'Expiry (MM/YY)',
                  prefixIcon: const Icon(Icons.calendar_today),
                  prefixIconColor: AppTheme.goldPrimary,
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextFormField(
                controller: _cvvController,
                decoration: InputDecoration(
                  labelText: 'CVV',
                  prefixIcon: const Icon(Icons.lock),
                  prefixIconColor: AppTheme.goldPrimary,
                ),
                keyboardType: TextInputType.number,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _phoneController,
          decoration: InputDecoration(
            labelText: 'Mobile Number for Receipt',
            hintText: '07X XXX XXXX',
            prefixIcon: const Icon(Icons.phone),
            prefixIconColor: AppTheme.goldPrimary,
          ),
        ),
        if (_paymentError != null)
          Padding(
            padding: const EdgeInsets.only(top: 16),
            child: Text(
              _paymentError!,
              style: TextStyle(color: AppTheme.crimson),
            ),
          ),
        const SizedBox(height: 24),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () {
                  setState(() => _currentStep = 0);
                },
                child: const Text('Back'),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: ElevatedButton(
                onPressed: _loadingPayment ? null : _processPayment,
                child: _loadingPayment
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Pay Now'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildConfirmationStep() {
    return Column(
      children: [
        Icon(
          Icons.check_circle,
          size: 80,
          color: AppTheme.goldPrimary,
        ),
        const SizedBox(height: 16),
        Text(
          'Payment Successful!',
          style: Theme.of(context).textTheme.displaySmall,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 32),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.cream,
            border: Border.all(color: AppTheme.goldDark, width: 2),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Official Receipt',
                style: TextStyle(
                  color: AppTheme.navyDeep,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Reference: ${_verifiedFine?.referenceNumber}',
                style: TextStyle(color: AppTheme.navyDeep),
              ),
              Text(
                'Amount: LKR ${_verifiedFine?.amount.toStringAsFixed(2)}',
                style: TextStyle(
                  color: AppTheme.navyDeep,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                'Status: PAID',
                style: TextStyle(color: AppTheme.navyDeep),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'SMS notification has been sent to the traffic officer.',
          style: Theme.of(context).textTheme.bodyMedium,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 32),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () => context.go('/home'),
            child: const Text('Return Home'),
          ),
        ),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall,
          ),
          Text(
            value,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppTheme.goldPrimary,
                ),
          ),
        ],
      ),
    );
  }

  Future<void> _verifyFine() async {
    if (_referenceController.text.isEmpty || _categoryController.text.isEmpty) {
      setState(() {
        _verificationError = 'Please enter both reference and category';
      });
      return;
    }

    setState(() {
      _loadingVerification = true;
      _verificationError = null;
    });

    try {
      final fine = await _fineService.getFineByReference(
        _referenceController.text,
        _categoryController.text,
      );
      setState(() {
        _verifiedFine = fine;
        _loadingVerification = false;
      });
    } catch (e) {
      setState(() {
        _verificationError = e.toString();
        _loadingVerification = false;
      });
    }
  }

  Future<void> _processPayment() async {
    if (_nameController.text.isEmpty ||
        _cardController.text.isEmpty ||
        _expController.text.isEmpty ||
        _cvvController.text.isEmpty ||
        _phoneController.text.isEmpty) {
      setState(() {
        _paymentError = 'Please fill all fields';
      });
      return;
    }

    setState(() {
      _loadingPayment = true;
      _paymentError = null;
    });

    try {
      await _paymentService.processPayment(
        fineId: _verifiedFine?.id ?? 0,
        amount: _verifiedFine?.amount ?? 0,
        cardNumber: _cardController.text,
        cardholderName: _nameController.text,
        expiryDate: _expController.text,
        cvv: _cvvController.text,
        driverPhone: _phoneController.text,
      );
      setState(() {
        _currentStep = 2;
        _loadingPayment = false;
      });
    } catch (e) {
      setState(() {
        _paymentError = e.toString();
        _loadingPayment = false;
      });
    }
  }

  @override
  void dispose() {
    _referenceController.dispose();
    _categoryController.dispose();
    _nameController.dispose();
    _cardController.dispose();
    _expController.dispose();
    _cvvController.dispose();
    _phoneController.dispose();
    super.dispose();
  }
}
