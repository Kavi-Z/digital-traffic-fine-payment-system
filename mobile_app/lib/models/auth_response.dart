class AuthResponse {
  final String token;
  final String? message;

  AuthResponse({
    required this.token,
    this.message,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json['token'] ?? '',
      message: json['message'],
    );
  }

  Map<String, dynamic> toJson() => {
    'token': token,
    'message': message,
  };
}

class AuthRequest {
  final String username;
  final String password;

  AuthRequest({
    required this.username,
    required this.password,
  });

  factory AuthRequest.fromJson(Map<String, dynamic> json) {
    return AuthRequest(
      username: json['username'] ?? '',
      password: json['password'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'username': username,
    'password': password,
  };
}

class RegisterRequest {
  final String username;
  final String password;
  final String fullName;
  final String contactNumber;
  final String role;

  RegisterRequest({
    required this.username,
    required this.password,
    required this.fullName,
    required this.contactNumber,
    required this.role,
  });

  factory RegisterRequest.fromJson(Map<String, dynamic> json) {
    return RegisterRequest(
      username: json['username'] ?? '',
      password: json['password'] ?? '',
      fullName: json['fullName'] ?? '',
      contactNumber: json['contactNumber'] ?? '',
      role: json['role'] ?? 'DRIVER',
    );
  }

  Map<String, dynamic> toJson() => {
    'username': username,
    'password': password,
    'fullName': fullName,
    'contactNumber': contactNumber,
    'role': role,
  };
}
