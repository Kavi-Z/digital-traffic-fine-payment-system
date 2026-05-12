import 'package:dio/dio.dart';
import '../models/auth_response.dart';
import 'api_client.dart';

class AuthService {
  final ApiClient _apiClient = ApiClient();

  Future<AuthResponse> login(String username, String password) async {
    try {
      final response = await _apiClient.post(
        '/auth/login',
        AuthRequest(username: username, password: password).toJson(),
      );

      if (response.statusCode == 200) {
        final authResponse = AuthResponse.fromJson(response.data);
        await _apiClient.setToken(authResponse.token);
        return authResponse;
      } else {
        throw Exception('Login failed: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Login error: ${e.message}');
    }
  }

  Future<AuthResponse> register(
    String username,
    String password,
    String fullName,
    String contactNumber,
    String role,
  ) async {
    try {
      final request = RegisterRequest(
        username: username,
        password: password,
        fullName: fullName,
        contactNumber: contactNumber,
        role: role,
      );

      final response = await _apiClient.post(
        '/auth/signup',
        request.toJson(),
      );

      if (response.statusCode == 200) {
        final authResponse = AuthResponse.fromJson(response.data);
        await _apiClient.setToken(authResponse.token);
        return authResponse;
      } else {
        throw Exception('Registration failed: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Registration error: ${e.message}');
    }
  }

  Future<void> logout() async {
    await _apiClient.clearToken();
  }

  Future<bool> isLoggedIn() async {
    final token = await _apiClient.getToken();
    return token != null && token.isNotEmpty;
  }

  Future<String?> getToken() async {
    return await _apiClient.getToken();
  }
}
