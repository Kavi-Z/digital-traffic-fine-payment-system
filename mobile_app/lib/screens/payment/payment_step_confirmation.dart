import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/payment_provider.dart';
import '../../theme/app_theme.dart';

class PaymentStepConfirmation extends StatelessWidget {
  final Function onNewTransaction;

  const PaymentStepConfirmation({
    Key? key,
    required this.onNewTransaction,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<PaymentProvider>(
      builder: (context, provider, _) {
        final receipt = provider.paymentReceipt;

        if (receipt == null) {
          return const SizedBox.shrink();
        }

        return Column(
          children: [
            Icon(
              Icons.check_circle_outline,
              size: 80,
              color: AppTheme.goldPrimary,
            ),
            const SizedBox(height: 24),
            Text(
              'Payment Successful!',
              style: Theme.of(context).textTheme.displaySmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.cream,
                border: Border.all(color: AppTheme.goldDark, width: 2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Official Receipt',
                    style: TextStyle(
                      color: AppTheme.navyDeep,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Divider(
                    color: AppTheme.goldDark,
                    thickness: 1,
                  ),
                  const SizedBox(height: 16),
                  _receiptRow(
                    'Transaction ID',
                    receipt.transactionId ?? 'N/A',
                    AppTheme.navyDeep,
                  ),
                  _receiptRow(
                    'Reference #',
                    receipt.referenceNumber,
                    AppTheme.navyDeep,
                  ),
                  _receiptRow(
                    'Category',
                    receipt.categoryName ?? 'N/A',
                    AppTheme.navyDeep,
                  ),
                  _receiptRow(
                    'Amount Paid',
                    'Rs. ${receipt.amount.toStringAsFixed(2)}',
                    AppTheme.navyDeep,
                    highlight: true,
                  ),
                  _receiptRow(
                    'Payment Method',
                    receipt.paymentMethod,
                    AppTheme.navyDeep,
                  ),
                  if (receipt.maskedCardNumber != null)
                    _receiptRow(
                      'Card',
                      receipt.maskedCardNumber!,
                      AppTheme.navyDeep,
                    ),
                  if (receipt.cardHolderName != null)
                    _receiptRow(
                      'Cardholder',
                      receipt.cardHolderName!,
                      AppTheme.navyDeep,
                    ),
                  _receiptRow(
                    'Status',
                    receipt.status.toUpperCase(),
                    AppTheme.navyDeep,
                  ),
                  if (receipt.driverName != null)
                    _receiptRow(
                      'Driver',
                      receipt.driverName!,
                      AppTheme.navyDeep,
                    ),
                  if (receipt.officerName != null)
                    _receiptRow(
                      'Officer',
                      receipt.officerName!,
                      AppTheme.navyDeep,
                    ),
                  const SizedBox(height: 16),
                  Divider(
                    color: AppTheme.goldDark,
                    thickness: 1,
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.goldPrimary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      receipt.smsSent
                          ? 'An SMS notification has been sent to the traffic officer. You may now retrieve your driving license.'
                          : 'Payment recorded. Please contact the issuing officer to retrieve your driving license.',
                      style: TextStyle(
                        color: AppTheme.navyDeep,
                        fontSize: 12,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => onNewTransaction(),
                icon: const Icon(Icons.add),
                label: const Text('Pay Another Fine'),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _receiptRow(String label, String value, Color color,
      {bool highlight = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: color.withValues(alpha: 0.7),
              fontSize: 14,
            ),
          ),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: TextStyle(
                color: highlight ? AppTheme.crimson : color,
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
