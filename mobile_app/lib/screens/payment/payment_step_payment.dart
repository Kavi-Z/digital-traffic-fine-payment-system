import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/payment_provider.dart';
import '../../theme/app_theme.dart';

class PaymentStepPayment extends StatefulWidget {
  final Function onNext;
  final Function onBack;

  const PaymentStepPayment({
    Key? key,
    required this.onNext,
    required this.onBack,
  }) : super(key: key);

  @override
  State<PaymentStepPayment> createState() => _PaymentStepPaymentState();
}

class _PaymentStepPaymentState extends State<PaymentStepPayment> {
  final _formKey = GlobalKey<FormState>();
  final _cardNumberController = TextEditingController();
  final _cardholderController = TextEditingController();
  final _expiryController = TextEditingController();
  final _cvvController = TextEditingController();
  final _phoneController = TextEditingController();
  final _payerNameController = TextEditingController();
  String _paymentMethod = 'CARD';

  @override
  void dispose() {
    _cardNumberController.dispose();
    _cardholderController.dispose();
    _expiryController.dispose();
    _cvvController.dispose();
    _phoneController.dispose();
    _payerNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<PaymentProvider>(
      builder: (context, provider, _) {
        final fine = provider.verifiedFine;
        if (fine == null) return const SizedBox.shrink();

        final isCardPayment = _paymentMethod == 'CARD';

        return Form(
          key: _formKey,
          child: Column(
            children: [
              Text(
                'Payment Information',
                style: Theme.of(context).textTheme.displaySmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.navyMid.withValues(alpha: 0.7),
                  border: Border.all(color: AppTheme.goldPrimary, width: 1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Fine Summary',
                      style: Theme.of(context).textTheme.labelLarge,
                    ),
                    const SizedBox(height: 12),
                    _summaryRow('Reference:', fine.referenceNumber),
                    _summaryRow(
                      'Category:',
                      fine.categoryName ?? fine.categoryIdentifier,
                    ),
                    _summaryRow(
                      'Amount:',
                      'Rs. ${fine.amount.toStringAsFixed(2)}',
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Payment Method',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 12),
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: 'CARD', label: Text('Card')),
                  ButtonSegment(value: 'ONLINE', label: Text('Online')),
                ],
                selected: {_paymentMethod},
                onSelectionChanged: (selection) {
                  setState(() => _paymentMethod = selection.first);
                },
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _payerNameController,
                decoration: InputDecoration(
                  labelText: 'Payer Name (optional)',
                  hintText: fine.driverName ?? 'Your name',
                  prefixIcon: const Icon(Icons.person_outline),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(
                  labelText: 'Contact Number',
                  hintText: '+94712345678',
                  prefixIcon: Icon(Icons.phone),
                ),
                keyboardType: TextInputType.phone,
                validator: (value) {
                  if (value?.isEmpty ?? true) {
                    return 'Please enter contact number';
                  }
                  return null;
                },
              ),
              if (isCardPayment) ...[
                const SizedBox(height: 24),
                Text(
                  'Card Details',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _cardNumberController,
                  decoration: const InputDecoration(
                    labelText: 'Card Number',
                    hintText: '1234 5678 9012 3456',
                    prefixIcon: Icon(Icons.credit_card),
                  ),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (!isCardPayment) return null;
                    if (value?.isEmpty ?? true) {
                      return 'Please enter card number';
                    }
                    if (value!.replaceAll(' ', '').length < 13) {
                      return 'Please enter valid card number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _cardholderController,
                  decoration: const InputDecoration(
                    labelText: 'Cardholder Name',
                    hintText: 'John Doe',
                    prefixIcon: Icon(Icons.person),
                  ),
                  validator: (value) {
                    if (!isCardPayment) return null;
                    if (value?.isEmpty ?? true) {
                      return 'Please enter cardholder name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: TextFormField(
                        controller: _expiryController,
                        decoration: const InputDecoration(
                          labelText: 'Expiry',
                          hintText: 'MM/YY',
                          prefixIcon: Icon(Icons.calendar_today),
                        ),
                        validator: (value) {
                          if (!isCardPayment) return null;
                          if (value?.isEmpty ?? true) {
                            return 'Required';
                          }
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: TextFormField(
                        controller: _cvvController,
                        decoration: const InputDecoration(
                          labelText: 'CVV',
                          hintText: '123',
                          prefixIcon: Icon(Icons.lock),
                        ),
                        keyboardType: TextInputType.number,
                        obscureText: true,
                        validator: (value) {
                          if (!isCardPayment) return null;
                          if (value?.isEmpty ?? true) {
                            return 'Required';
                          }
                          if (value!.length < 3) {
                            return 'Invalid';
                          }
                          return null;
                        },
                      ),
                    ),
                  ],
                ),
              ],
              const SizedBox(height: 24),
              if (provider.errorMessage != null)
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.crimson.withValues(alpha: 0.1),
                    border: Border.all(color: AppTheme.crimson),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    provider.errorMessage!,
                    style: TextStyle(color: AppTheme.crimson),
                  ),
                ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => widget.onBack(),
                      child: const Text('Back'),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: provider.isLoading
                          ? null
                          : () async {
                              if (_formKey.currentState!.validate()) {
                                final success = await provider.processPayment(
                                  paymentMethod: _paymentMethod,
                                  cardNumber: isCardPayment
                                      ? _cardNumberController.text
                                      : null,
                                  cardHolderName: isCardPayment
                                      ? _cardholderController.text
                                      : null,
                                  cardExpiry: isCardPayment
                                      ? _expiryController.text
                                      : null,
                                  cardCvv: isCardPayment
                                      ? _cvvController.text
                                      : null,
                                  payerName: _payerNameController.text.isEmpty
                                      ? null
                                      : _payerNameController.text,
                                  payerContact: _phoneController.text,
                                );
                                if (success && mounted) {
                                  widget.onNext();
                                }
                              }
                            },
                      child: provider.isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  AppTheme.navyDeep,
                                ),
                              ),
                            )
                          : const Text('Process Payment'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _summaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: AppTheme.cream.withValues(alpha: 0.7),
            ),
          ),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: TextStyle(
                color: AppTheme.cream,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
