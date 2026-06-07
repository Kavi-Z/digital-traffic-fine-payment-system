class FineModel {
  final String? id;
  final String referenceNumber;
  final String categoryIdentifier;
  final String? categoryName;
  final double amount;
  final String driverLicenseNumber;
  final String? driverName;
  final String? vehicleNumber;
  final String? district;
  final String status;
  final String? issuedAt;
  final String? paidAt;
  final String? issuedByOfficerName;
  final int? pointsDeducted;
  final String? location;

  FineModel({
    this.id,
    required this.referenceNumber,
    required this.categoryIdentifier,
    this.categoryName,
    required this.amount,
    required this.driverLicenseNumber,
    this.driverName,
    this.vehicleNumber,
    this.district,
    this.status = 'UNPAID',
    this.issuedAt,
    this.paidAt,
    this.issuedByOfficerName,
    this.pointsDeducted,
    this.location,
  });

  factory FineModel.fromJson(Map<String, dynamic> json) {
    return FineModel(
      id: json['id']?.toString(),
      referenceNumber: json['referenceNumber'] ?? '',
      categoryIdentifier: json['categoryIdentifier'] ?? '',
      categoryName: json['categoryName'],
      amount: (json['amount'] ?? 0).toDouble(),
      driverLicenseNumber: json['driverLicenseNumber'] ?? '',
      driverName: json['driverName'],
      vehicleNumber: json['vehicleNumber'],
      district: json['district'],
      status: json['status'] ?? 'UNPAID',
      issuedAt: json['issuedAt']?.toString(),
      paidAt: json['paidAt']?.toString(),
      issuedByOfficerName: json['issuedByOfficerName'],
      pointsDeducted: json['pointsDeducted'],
      location: json['location'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'referenceNumber': referenceNumber,
    'categoryIdentifier': categoryIdentifier,
    'categoryName': categoryName,
    'amount': amount,
    'driverLicenseNumber': driverLicenseNumber,
    'driverName': driverName,
    'vehicleNumber': vehicleNumber,
    'district': district,
    'status': status,
    'issuedAt': issuedAt,
    'paidAt': paidAt,
    'issuedByOfficerName': issuedByOfficerName,
    'pointsDeducted': pointsDeducted,
    'location': location,
  };
}
