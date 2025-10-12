; ============================================
; Script personalizado NSIS - Sistema EXMC
; Desarrollador: Luciano Savoretti
; Instagram: @devpuchito
; ============================================

!macro customHeader
  ; Información del desarrollador en propiedades del instalador
  VIAddVersionKey "CompanyName" "Luciano Savoretti"
  VIAddVersionKey "ProductName" "Sistema EXMC"
  VIAddVersionKey "FileDescription" "Sistema de Gestión Comercial"
  VIAddVersionKey "LegalCopyright" "© 2025 Luciano Savoretti - Dev/Sistemas/Web"
  VIAddVersionKey "Comments" "Desarrollado por Luciano Savoretti | Instagram: @devpuchito"
  VIAddVersionKey "InternalName" "SistemaEXMC"
  VIAddVersionKey "OriginalFilename" "Sistema EXMC-Setup-1.0.0.exe"
!macroend

!macro customInstall
  ; Agregar archivo de créditos en la carpeta de instalación
  FileOpen $0 "$INSTDIR\CREDITOS.txt" w
  FileWrite $0 "═══════════════════════════════════════════════════$\r$\n"
  FileWrite $0 "           SISTEMA EXMC v1.0.0$\r$\n"
  FileWrite $0 "      Sistema de Gestión Comercial$\r$\n"
  FileWrite $0 "═══════════════════════════════════════════════════$\r$\n"
  FileWrite $0 "$\r$\n"
  FileWrite $0 "DESARROLLADOR:$\r$\n"
  FileWrite $0 "  Luciano Savoretti$\r$\n"
  FileWrite $0 "  Dev / Sistemas / Web$\r$\n"
  FileWrite $0 "$\r$\n"
  FileWrite $0 "CONTACTO:$\r$\n"
  FileWrite $0 "  Instagram: @devpuchito$\r$\n"
  FileWrite $0 "  https://www.instagram.com/devpuchito/$\r$\n"
  FileWrite $0 "$\r$\n"
  FileWrite $0 "Para más información, abre el archivo 'Acerca de.html'$\r$\n"
  FileWrite $0 "$\r$\n"
  FileWrite $0 "═══════════════════════════════════════════════════$\r$\n"
  FileWrite $0 "Copyright © 2025 Luciano Savoretti$\r$\n"
  FileWrite $0 "Todos los derechos reservados.$\r$\n"
  FileWrite $0 "═══════════════════════════════════════════════════$\r$\n"
  FileClose $0
  
  ; Crear acceso directo clickeable a Instagram del desarrollador
  FileOpen $0 "$INSTDIR\Instagram del Desarrollador.url" w
  FileWrite $0 "[InternetShortcut]$\r$\n"
  FileWrite $0 "URL=https://www.instagram.com/devpuchito/$\r$\n"
  FileWrite $0 "IconIndex=0$\r$\n"
  FileClose $0
  
  ; Copiar página HTML Acerca de
  File "$%BUILD_RESOURCES_DIR%\ACERCA-DE.html"
  Rename "$INSTDIR\ACERCA-DE.html" "$INSTDIR\Acerca de Sistema EXMC.html"
  
  ; Crear accesos directos en el menú Inicio
  CreateDirectory "$SMPROGRAMS\Sistema EXMC"
  CreateShortCut "$SMPROGRAMS\Sistema EXMC\Instagram @devpuchito.lnk" "https://www.instagram.com/devpuchito/"
  CreateShortCut "$SMPROGRAMS\Sistema EXMC\Acerca de.lnk" "$INSTDIR\Acerca de Sistema EXMC.html"
!macroend

!macro customInit
  ; Mensaje al iniciar el instalador
  MessageBox MB_ICONINFORMATION "Sistema EXMC v1.0.0$\r$\n$\r$\nDesarrollado por:$\r$\nLuciano Savoretti$\r$\n@devpuchito$\r$\n$\r$\nSistema de Gestión Comercial"
!macroend
