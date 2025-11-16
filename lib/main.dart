import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(const EasySocApp());
}

class EasySocApp extends StatelessWidget {
  const EasySocApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Easy SOC',
      debugShowCheckedModeBanner: false,
      home: const EasySocWebView(),
    );
  }
}

class EasySocWebView extends StatefulWidget {
  const EasySocWebView({super.key});

  @override
  State<EasySocWebView> createState() => _EasySocWebViewState();
}

class _EasySocWebViewState extends State<EasySocWebView> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFFFFFFFF))
      ..loadRequest(
        Uri.parse('https://easy-soc-front.onrender.com'),
      );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: WebViewWidget(controller: _controller),
      ),
    );
  }
}
