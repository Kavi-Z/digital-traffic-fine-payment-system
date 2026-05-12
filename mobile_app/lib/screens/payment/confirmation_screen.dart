import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../theme/app_theme.dart';

class ConfirmationScreen extends StatelessWidget {
  final Map<String, dynamic> receipt;

  const ConfirmationScreen({
    Key? key,
    required this.receipt,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [AppTheme.navyDeep, AppTheme.navyMid],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.check_circle,
                  size: 80,
                  color: AppTheme.goldPrimary,
                ),
                const SizedBox(height: 24),
                Text(
                  'Payment Successful',
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
                      _receiptRow('Receipt Number', receipt['receiptNumber'] ?? ''),
                      _receiptRow('Reference', receipt['referenceNumber'] ?? ''),
                      _receiptRow('Amount', receipt['amountPaid'] ?? ''),
                      _receiptRow('Transaction ID', receipt['transactionId'] ?? ''),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'An SMS notification has been sent to the traffic officer. You may now retrieve your driving license.',
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
            ),
          ),
        ),
      ),
    );
  }

  Widget _receiptRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              color: AppTheme.navyDeep,
              fontWeight: FontWeight.w600,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: AppTheme.navyDeep,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
