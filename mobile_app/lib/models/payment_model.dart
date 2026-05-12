class PaymentModel {
  final int? id;
  final int fineId;
  final double amount;
  final String status;
  final String? timestamp;
  final String? driverPhone;
  final String? receiptNumber;
  final String? transactionId;

  PaymentModel({
    this.id,
    required this.fineId,
    required this.amount,
    this.status = 'PENDING',
    this.timestamp,
    this.driverPhone,
    this.receiptNumber,
    this.transactionId,
  });

  factory PaymentModel.fromJson(Map<String, dynamic> json) {
    return PaymentModel(
      id: json['id'],
      fineId: json['fineId'] ?? 0,
      amount: (json['amount'] ?? 0).toDouble(),
      status: json['status'] ?? 'PENDING',
      timestamp: json['timestamp'],
      driverPhone: json['driverPhone'],
      receiptNumber: json['receiptNumber'],
      transactionId: json['transactionId'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'fineId': fineId,
    'amount': amount,
    'status': status,
    'timestamp': timestamp,
    'driverPhone': driverPhone,
    'receiptNumber': receiptNumber,
    'transactionId': transactionId,
  };
}
