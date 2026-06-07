# Traffic Fines Mobile App - Flutter

Sri Lanka Police Traffic Fine Payment Mobile Application built with Flutter.

## Features

- 🚗 **On-the-Spot Payment**: Pay traffic fines directly from the home screen
- 💳 **Multi-Step Payment**: Verify → Pay → Confirm workflow
- 📱 **Mobile-First**: Optimized for Android devices
- 🎨 **Government Theme**: Sri Lankan Police branded UI
- 🔄 **State Management**: Provider-based state management
- 🌐 **REST API Integration**: Connects to backend API

## Project Structure

```
lib/
├── main.dart                    # Application entry point
├── theme/
│   └── app_theme.dart          # Theme configuration (colors, typography)
├── models/
│   ├── fine_model.dart         # Traffic fine data model
│   ├── payment_model.dart      # Payment data model
│   └── auth_response.dart      # Authentication response models
├── services/
│   ├── api_client.dart         # HTTP client with JWT support
│   ├── fine_service.dart       # Fine-related API calls
│   └── payment_service.dart    # Payment-related API calls
├── providers/
│   └── payment_provider.dart   # Payment flow state management
├── router/
│   └── app_router.dart         # Navigation configuration
└── screens/
    ├── home/
    │   └── home_screen.dart    # Main payment flow screen
    └── payment/
        ├── payment_step_verify.dart         # Step 1: Verify fine
        ├── payment_step_payment.dart        # Step 2: Process payment
        └── payment_step_confirmation.dart   # Step 3: Show receipt
```

## Getting Started

### Prerequisites

- Flutter SDK (3.2.0 or higher)
- Android SDK
- An IDE (Android Studio, VSCode)

### Installation

1. Navigate to mobile_app directory
```bash
cd digital-traffic-fine-payment-system/mobile_app
```

2. Get dependencies
```bash
flutter pub get
```

3. Run the application
```bash
flutter run
```

## Payment Flow

The app implements a **3-step payment process**:

### Step 1: Fine Verification
- Enter Fine Reference Number (e.g., TF-2026-00001)
- Enter Category Identifier (A, B, C)
- System verifies fine details from backend

### Step 2: Payment Details
- Enter credit card information
- Enter cardholder name
- Enter expiry date and CVV
- Enter phone number for SMS notification

### Step 3: Confirmation
- Display payment receipt
- Show transaction ID
- SMS sent to traffic officer
- Option to pay another fine

## API Integration

The app connects to the backend API at `http://localhost:8080/api/v1`

### Key Endpoints Required:
- `GET /fines/lookup?referenceNumber=X&categoryId=Y` - Search fine by reference
- `POST /payments` - Process payment
  ```json
  {
    "fineId": 1,
    "amount": 5000,
    "cardNumber": "1234567890123456",
    "cardholderName": "John Doe",
    "expiryDate": "12/25",
    "cvv": "123",
    "driverPhone": "+94712345678"
  }
  ```
- `GET /payments/{id}` - Get payment status

## Build for Production

### Android APK
```bash
flutter build apk --release
```

### Android App Bundle
```bash
flutter build appbundle --release
```

## Architecture & State Management

**Provider Pattern**: Used for managing payment flow state across screens.

```dart
PaymentProvider
├── verifyFine()        // Step 1: Verify fine
├── processPayment()    // Step 2: Process payment
├── nextStep()          // Navigate between steps
├── previousStep()      // Go back to previous step
└── reset()             // Clear for new transaction
```

## UI/UX

- **Government Theme**: Navy blue (#001a33), Gold (#C9A84C), Crimson (#B22222)
- **Step Indicator**: Visual progress through payment steps
- **Form Validation**: Real-time field validation
- **Error Handling**: User-friendly error messages
- **Loading States**: Clear feedback during API calls

## Dependencies

- `provider` ^6.1.0 - State management
- `go_router` ^12.1.0 - Navigation
- `dio` ^5.3.0 - HTTP client
- `shared_preferences` ^2.2.2 - Local storage
- `google_fonts` ^6.1.0 - Typography
- `camera` ^0.10.5+2 - Device camera
- `image_picker` ^1.0.4 - Image selection
- `permission_handler` ^12.0.1 - Permission management

See `pubspec.yaml` for complete list.

## Recent Changes (No Auth Required)

- ✅ Removed login and signup screens
- ✅ Removed authentication provider
- ✅ Made home screen the entry point
- ✅ Integrated full payment flow into single experience
- ✅ Direct access to traffic fine payment

## Future Enhancements

- QR code scanning for fine details
- Payment history view
- Receipt download/share
- Multi-language support
- Offline payment capability
- Multiple payment methods
- Push notifications

## License

This project is part of the Sri Lanka Police Department's digital transformation initiative.

## Support

For issues and feature requests, contact the development team.

