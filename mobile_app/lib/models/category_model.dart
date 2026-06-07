class CategoryModel {
  final String id;
  final String identifier;
  final String name;
  final double amount;
  final int pointsDeducted;
  final String? description;
  final bool active;

  CategoryModel({
    required this.id,
    required this.identifier,
    required this.name,
    required this.amount,
    required this.pointsDeducted,
    this.description,
    this.active = true,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['id']?.toString() ?? '',
      identifier: json['identifier'] ?? '',
      name: json['name'] ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
      pointsDeducted: json['pointsDeducted'] ?? 0,
      description: json['description'],
      active: json['active'] ?? true,
    );
  }
}
