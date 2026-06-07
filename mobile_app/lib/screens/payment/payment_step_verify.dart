import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/payment_provider.dart';
import '../../theme/app_theme.dart';

class PaymentStepVerify extends StatefulWidget {
  final Function onNext;

  const PaymentStepVerify({
    Key? key,
    required this.onNext,
  }) : super(key: key);

  @override
  State<PaymentStepVerify> createState() => _PaymentStepVerifyState();
}

class _PaymentStepVerifyState extends State<PaymentStepVerify> {
  final _referenceController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String? _selectedCategoryId;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PaymentProvider>().loadCategories();
    });
  }

  @override
  void dispose() {
    _referenceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<PaymentProvider>(
      builder: (context, provider, _) {
        if (provider.verifiedFine != null) {
          final fine = provider.verifiedFine!;
          return Column(
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.navyMid.withValues(alpha: 0.5),
                  border: Border.all(color: AppTheme.goldPrimary, width: 2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Fine Details',
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.goldPrimary,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            'Verified',
                            style: TextStyle(
                              color: AppTheme.navyDeep,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _fineDetailRow('Reference #', fine.referenceNumber),
                    _fineDetailRow(
                      'Category',
                      fine.categoryName ?? fine.categoryIdentifier,
                    ),
                    _fineDetailRow(
                      'Amount',
                      'Rs. ${fine.amount.toStringAsFixed(2)}',
                      highlight: true,
                    ),
                    _fineDetailRow('License #', fine.driverLicenseNumber),
                    if (fine.driverName != null)
                      _fineDetailRow('Driver', fine.driverName!),
                    if (fine.vehicleNumber != null)
                      _fineDetailRow('Vehicle', fine.vehicleNumber!),
                    if (fine.district != null)
                      _fineDetailRow('District', fine.district!),
                    if (fine.issuedByOfficerName != null)
                      _fineDetailRow('Officer', fine.issuedByOfficerName!),
                    if (fine.location != null)
                      _fineDetailRow('Location', fine.location!),
                    if (fine.pointsDeducted != null)
                      _fineDetailRow(
                        'Points Deducted',
                        fine.pointsDeducted.toString(),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  ElevatedButton.icon(
                    onPressed: () {
                      _referenceController.clear();
                      setState(() => _selectedCategoryId = null);
                      provider.reset();
                    },
                    icon: const Icon(Icons.close),
                    label: const Text('Cancel'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.crimson,
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => widget.onNext(),
                    icon: const Icon(Icons.arrow_forward),
                    label: const Text('Proceed to Payment'),
                  ),
                ],
              ),
            ],
          );
        }

        return Form(
          key: _formKey,
          child: Column(
            children: [
              Text(
                'Fine Verification',
                style: Theme.of(context).textTheme.displaySmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              TextFormField(
                controller: _referenceController,
                decoration: InputDecoration(
                  labelText: 'Fine Reference Number',
                  hintText: 'e.g., TF-2026-A1B2C',
                  prefixIcon: const Icon(Icons.receipt),
                ),
                validator: (value) {
                  if (value?.isEmpty ?? true) {
                    return 'Please enter reference number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              if (provider.isLoadingCategories)
                const Padding(
                  padding: EdgeInsets.all(16),
                  child: CircularProgressIndicator(),
                )
              else if (provider.categories.isEmpty)
                TextFormField(
                  initialValue: _selectedCategoryId,
                  decoration: InputDecoration(
                    labelText: 'Category Identifier',
                    hintText: 'e.g., SPD, SIG, LIC',
                    prefixIcon: const Icon(Icons.category),
                  ),
                  onChanged: (value) => _selectedCategoryId = value,
                  validator: (value) {
                    if (_selectedCategoryId?.isEmpty ?? true) {
                      return 'Please enter category';
                    }
                    return null;
                  },
                )
              else
                DropdownButtonFormField<String>(
                  initialValue: _selectedCategoryId,
                  decoration: InputDecoration(
                    labelText: 'Violation Category',
                    prefixIcon: const Icon(Icons.category),
                  ),
                  items: provider.categories.map((category) {
                    return DropdownMenuItem(
                      value: category.identifier,
                      child: Text(
                        '${category.identifier} - ${category.name}',
                        overflow: TextOverflow.ellipsis,
                      ),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() => _selectedCategoryId = value);
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please select a category';
                    }
                    return null;
                  },
                ),
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
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: provider.isLoading
                      ? null
                      : () async {
                          if (_formKey.currentState!.validate()) {
                            final success = await provider.verifyFine(
                              _referenceController.text.trim(),
                              _selectedCategoryId!.trim(),
                            );
                            if (success && mounted) {
                              setState(() {});
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
                      : const Text('Verify Fine'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _fineDetailRow(String label, String value, {bool highlight = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: AppTheme.cream.withValues(alpha: 0.7),
              fontSize: 14,
            ),
          ),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: TextStyle(
                color: highlight ? AppTheme.goldPrimary : AppTheme.cream,
                fontSize: 14,
                fontWeight: highlight ? FontWeight.bold : FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
