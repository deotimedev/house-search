#!/bin/bash

echo "const characters = ["

for file in static/characters/*; do
    filename=$(basename "$file")
    name=$(echo "${filename%.*}" | sed -e "s/^\(.\)/\U\1/")
    echo "    \"$name\","
done
echo "]"
read