#!/bin/bash

echo "==== Instalando Flutter SDK ===="

# baixar flutter
git clone https://github.com/flutter/flutter.git -b stable

# adicionar flutter ao PATH
export PATH="$PATH:$(pwd)/flutter/bin"

flutter --version

echo "==== Instalando dependências ===="
flutter pub get

echo "==== Build Final ===="
flutter build web --release
