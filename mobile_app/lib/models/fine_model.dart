class FineModel {
  final int? id;
  final String referenceNumber;
  final String categoryIdentifier;
  final double amount;
  final String driverLicenseNumber;
  final String status;
  final String? issuedAt;
  final String? officerName;
  final String? location;

  FineModel({
    this.id,
    required this.referenceNumber,
    required this.categoryIdentifier,
    required this.amount,
    required this.driverLicenseNumber,
    this.status = 'UNPAID',
    this.issuedAt,
    this.officerName,
    this.location,
  });

  factory FineModel.fromJson(Map<String, dynamic> json) {
    return FineModel(
      id: json['id'],
      referenceNumber: json['referenceNumber'] ?? '',
      categoryIdentifier: json['categoryIdentifier'] ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
      driverLicenseNumber: json['driverLicenseNumber'] ?? '',
      status: json['status'] ?? 'UNPAID',
      issuedAt: json['issuedAt'],
      officerName: json['officerName'],
      location: json['location'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'referenceNumber': referenceNumber,
    'categoryIdentifier': categoryIdentifier,
    'amount': amount,
    'driverLicenseNumber': driverLicenseNumber,
    'status': status,
    'issuedAt': issuedAt,
    'officerName': officerName,
    'location': location,
  };
}
