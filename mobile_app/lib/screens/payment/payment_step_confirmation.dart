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
        final fine = provider.verifiedFine;
        final receipt = provider.paymentReceipt;

        if (fine == null || receipt == null) {
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

            // Receipt Card
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
                    fine.referenceNumber,
                    AppTheme.navyDeep,
                  ),
                  _receiptRow(
                    'Category',
                    fine.categoryIdentifier,
                    AppTheme.navyDeep,
                  ),
                  _receiptRow(
                    'Amount Paid',
                    'Rs. ${fine.amount.toStringAsFixed(2)}',
                    AppTheme.navyDeep,
                    highlight: true,
                  ),
                  _receiptRow(
                    'Status',
                    receipt.status.toUpperCase(),
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
                      'An SMS notification has been sent to the traffic officer. You may now retrieve your driving license.',
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
          Text(
            value,
            style: TextStyle(
              color: highlight ? AppTheme.crimson : color,
              fontSize: 14,
              fontWeight: highlight ? FontWeight.bold : FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
