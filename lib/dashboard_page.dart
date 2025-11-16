import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'config.dart';
import 'details_page.dart';
import 'package:fl_chart/fl_chart.dart';

class DashboardPage extends StatefulWidget {
  final String token;
  final String nome;
  final int clientId;

  const DashboardPage({
    super.key,
    required this.token,
    required this.nome,
    required this.clientId,
  });

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  Map<String, dynamic>? resumo;
  bool carregando = true;

  @override
  void initState() {
    super.initState();
    carregarResumo();
  }

  Future<void> carregarResumo() async {
    try {
      final response = await http.get(
        Uri.parse('${AppConfig.baseUrl}/api/resumo/${widget.clientId}'),
        headers: {'Authorization': 'Bearer ${widget.token}'},
      );

      if (response.statusCode == 200) {
        setState(() {
          resumo = jsonDecode(response.body);
          carregando = false;
        });
      }
    } catch (e) {
      print("Erro ao carregar resumo: $e");
      setState(() => carregando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (carregando) {
      return const Scaffold(
        backgroundColor: Color(0xFF11111A),
        body: Center(
          child: CircularProgressIndicator(color: Colors.blueAccent),
        ),
      );
    }

    if (resumo == null) {
      return const Scaffold(
        backgroundColor: Color(0xFF11111A),
        body: Center(
          child: Text("Falha ao carregar dados", style: TextStyle(color: Colors.redAccent)),
        ),
      );
    }

    final maquinasSeguras = resumo!["maquinasSeguras"] ?? 0;
    final maquinasTotais = resumo!["maquinasTotais"] ?? 0;
    final vulnerabilidades = resumo!["vulnerabilidades"] ?? 0;
    final riscos = resumo!["riscos"] ?? 0;
    final incidentes = resumo!["incidentes"] ?? 0;

    return Scaffold(
      backgroundColor: const Color(0xFF11111A),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 40),
            const Text("EASY SOC", style: TextStyle(color: Colors.blueAccent, fontSize: 28)),
            const Text("defAInder",
                style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text("Bem-vindo, ${widget.nome} 👋",
                style: const TextStyle(color: Colors.amberAccent, fontSize: 16)),
            const SizedBox(height: 8),
            const Text("Resumo da segurança da sua empresa",
                style: TextStyle(color: Colors.white70, fontSize: 14)),
            const SizedBox(height: 40),

            // === GRÁFICO CIRCULAR ===
            const Text("Distribuição de Segurança",
                style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            SizedBox(
              width: 220,
              height: 220,
              child: PieChart(
                PieChartData(
                  sections: [
                    PieChartSectionData(
                      color: Colors.greenAccent,
                      value: maquinasSeguras.toDouble(),
                      title: "$maquinasSeguras Seguras",
                      radius: 60,
                      titleStyle: const TextStyle(color: Colors.black, fontSize: 12),
                    ),
                    PieChartSectionData(
                      color: Colors.redAccent,
                      value: (maquinasTotais - maquinasSeguras).toDouble(),
                      title: "${maquinasTotais - maquinasSeguras} Não Seguras",
                      radius: 60,
                      titleStyle: const TextStyle(color: Colors.black, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 30),

            // === ITENS DO DASHBOARD ===
            buildCard("Máquinas Protegidas", "$maquinasSeguras de $maquinasTotais Seguras"),
            buildCard("Vulnerabilidades", "$vulnerabilidades Encontradas"),
            buildCard("Riscos", "$riscos Críticos"),
            buildCard("Incidentes", "$incidentes Detectados"),
          ],
        ),
      ),
    );
  }

  Widget buildCard(String titulo, String subtitulo) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => DetailsPage(
              titulo: titulo,
              token: widget.token,
              clientId: widget.clientId,
            ),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1E1E2A),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              titulo,
              style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              subtitulo,
              style: const TextStyle(color: Colors.white70, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }
}
