import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/payment_provider.dart';
import '../../theme/app_theme.dart';
import '../payment/payment_step_verify.dart';
import '../payment/payment_step_payment.dart';
import '../payment/payment_step_confirmation.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Traffic Fine Payment'),
        centerTitle: true,
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [AppTheme.navyDeep, AppTheme.navyMid],
          ),
        ),
        child: Consumer<PaymentProvider>(
          builder: (context, provider, _) {
            return SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  // Step Indicator
                  _buildStepIndicator(provider.currentStep),
                  const SizedBox(height: 32),

                  // Step Content
                  if (provider.currentStep == 0)
                    PaymentStepVerify(
                      onNext: () => provider.nextStep(),
                    )
                  else if (provider.currentStep == 1)
                    PaymentStepPayment(
                      onNext: () => provider.nextStep(),
                      onBack: () => provider.previousStep(),
                    )
                  else if (provider.currentStep == 2)
                    PaymentStepConfirmation(
                      onNewTransaction: () => provider.reset(),
                    ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildStepIndicator(int currentStep) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildStepCircle(0, 'Verify', currentStep),
        Container(
          height: 2,
          width: 40,
          color: currentStep >= 1 ? AppTheme.goldPrimary : Colors.grey,
        ),
        _buildStepCircle(1, 'Pay', currentStep),
        Container(
          height: 2,
          width: 40,
          color: currentStep >= 2 ? AppTheme.goldPrimary : Colors.grey,
        ),
        _buildStepCircle(2, 'Confirm', currentStep),
      ],
    );
  }

  Widget _buildStepCircle(int step, String label, int currentStep) {
    final isActive = currentStep >= step;
    final isCurrent = currentStep == step;

    return Column(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isCurrent
                ? AppTheme.goldPrimary
                : isActive
                    ? AppTheme.goldDark
                    : AppTheme.navyMid,
            border: Border.all(
              color: AppTheme.goldPrimary,
              width: isCurrent ? 2 : 1,
            ),
          ),
          child: Center(
            child: Text(
              '${step + 1}',
              style: TextStyle(
                color: isCurrent || isActive ? AppTheme.navyDeep : AppTheme.cream,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: TextStyle(
            color: isCurrent || isActive ? AppTheme.goldPrimary : AppTheme.cream,
            fontSize: 12,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
