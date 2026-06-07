class PaymentModel {
  final String? transactionId;
  final String referenceNumber;
  final String? categoryName;
  final double amount;
  final String paymentMethod;
  final String? maskedCardNumber;
  final String? cardHolderName;
  final String status;
  final String? paidAt;
  final String? driverLicenseNumber;
  final String? driverName;
  final String? district;
  final String? officerName;
  final bool smsSent;

  PaymentModel({
    this.transactionId,
    required this.referenceNumber,
    this.categoryName,
    required this.amount,
    required this.paymentMethod,
    this.maskedCardNumber,
    this.cardHolderName,
    this.status = 'SUCCESS',
    this.paidAt,
    this.driverLicenseNumber,
    this.driverName,
    this.district,
    this.officerName,
    this.smsSent = false,
  });

  factory PaymentModel.fromJson(Map<String, dynamic> json) {
    return PaymentModel(
      transactionId: json['transactionId'],
      referenceNumber: json['referenceNumber'] ?? '',
      categoryName: json['categoryName'],
      amount: (json['amount'] ?? 0).toDouble(),
      paymentMethod: json['paymentMethod'] ?? 'CARD',
      maskedCardNumber: json['maskedCardNumber'],
      cardHolderName: json['cardHolderName'],
      status: json['status'] ?? 'SUCCESS',
      paidAt: json['paidAt']?.toString(),
      driverLicenseNumber: json['driverLicenseNumber'],
      driverName: json['driverName'],
      district: json['district'],
      officerName: json['officerName'],
      smsSent: json['smsSent'] ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'transactionId': transactionId,
    'referenceNumber': referenceNumber,
    'categoryName': categoryName,
    'amount': amount,
    'paymentMethod': paymentMethod,
    'maskedCardNumber': maskedCardNumber,
    'cardHolderName': cardHolderName,
    'status': status,
    'paidAt': paidAt,
    'driverLicenseNumber': driverLicenseNumber,
    'driverName': driverName,
    'district': district,
    'officerName': officerName,
    'smsSent': smsSent,
  };
}
