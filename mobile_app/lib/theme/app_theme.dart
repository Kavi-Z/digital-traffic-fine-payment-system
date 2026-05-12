import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Colors - Sri Lankan Police Theme
  static const Color navyDeep = Color(0xFF001a33);
  static const Color navyMid = Color(0xFF003d66);
  static const Color goldPrimary = Color(0xFFC9A84C);
  static const Color goldLight = Color(0xFFE8C96C);
  static const Color goldDark = Color(0xFFA68030);
  static const Color crimson = Color(0xFFB22222);
  static const Color cream = Color(0xFFF5E6D3);
  static const Color creamLight = Color(0xFFFFEFD5);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: goldPrimary,
        primary: navyDeep,
        secondary: goldPrimary,
        tertiary: crimson,
        surface: creamLight,
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: navyDeep,
      appBarTheme: AppBarTheme(
        backgroundColor: navyDeep,
        foregroundColor: cream,
        elevation: 2,
        centerTitle: true,
        titleTextStyle: GoogleFonts.playfairDisplay(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: goldPrimary,
        ),
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.playfairDisplay(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: goldPrimary,
        ),
        displayMedium: GoogleFonts.playfairDisplay(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: goldPrimary,
        ),
        displaySmall: GoogleFonts.playfairDisplay(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: goldPrimary,
        ),
        headlineMedium: GoogleFonts.playfairDisplay(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: cream,
        ),
        bodyLarge: GoogleFonts.crimsonText(
          fontSize: 16,
          color: cream,
        ),
        bodyMedium: GoogleFonts.crimsonText(
          fontSize: 14,
          color: cream,
        ),
        bodySmall: GoogleFonts.crimsonText(
          fontSize: 12,
          color: cream,
        ),
        labelLarge: GoogleFonts.playfairDisplay(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          letterSpacing: 1.5,
          color: goldPrimary,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: navyMid,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: goldPrimary, width: 1),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: goldPrimary, width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: goldLight, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: crimson, width: 1),
        ),
        hintStyle: GoogleFonts.crimsonText(
          color: Colors.grey[400],
          fontSize: 14,
        ),
        labelStyle: GoogleFonts.playfairDisplay(
          color: goldPrimary,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: goldPrimary,
          foregroundColor: navyDeep,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          textStyle: GoogleFonts.playfairDisplay(
            fontWeight: FontWeight.bold,
            fontSize: 16,
            letterSpacing: 0.5,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: goldPrimary,
          side: const BorderSide(color: goldPrimary, width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          textStyle: GoogleFonts.playfairDisplay(
            fontWeight: FontWeight.bold,
            fontSize: 14,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }
}
