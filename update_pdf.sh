#!/bin/sh

libreoffice --headless -convert-to pdf Matthew_Kuzminski.docx -outdir ./
sed -i -r "s|<span id=\"last-modified\">(.*)</span>|<span id=\"last-modified\">$(date -r Matthew_Kuzminski.pdf)</span>|" index.html