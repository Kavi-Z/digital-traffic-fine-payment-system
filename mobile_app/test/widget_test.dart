import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:traffic_fines_mobile/main.dart';

void main() {
  testWidgets('Payment app loads home screen', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const TrafficFinesApp());

    // Verify that the home screen loads with the step indicator
    expect(find.text('Traffic Fine Payment'), findsOneWidget);
    expect(find.text('Verify'), findsOneWidget);
    expect(find.text('Pay'), findsOneWidget);
    expect(find.text('Confirm'), findsOneWidget);
  });
}
