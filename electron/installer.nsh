; ============================================
; Script personalizado NSIS - Sistema EXMC
; Desarrollador: Luciano Savoretti
; Instagram: @devpuchito
; WhatsApp: +54 2657580979
; ============================================

!macro customHeader
  ; Información del desarrollador en propiedades del instalador
  VIAddVersionKey "CompanyName" "Luciano Savoretti"
  VIAddVersionKey "ProductName" "Sistema EXMC"
  VIAddVersionKey "FileDescription" "Sistema de Gestión Comercial"
  VIAddVersionKey "LegalCopyright" "© 2025 Luciano Savoretti - Dev/Sistemas/Web"
  VIAddVersionKey "Comments" "Desarrollado por Luciano Savoretti | Instagram: @devpuchito | WhatsApp: +54 2657580979"
  VIAddVersionKey "InternalName" "SistemaEXMC"
  VIAddVersionKey "OriginalFilename" "Sistema EXMC-Setup-1.0.0.exe"
!macroend

!macro customInstall
  ; Agregar archivo de créditos con toda la info de contacto
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
  FileWrite $0 "  WhatsApp: +54 2657580979$\r$\n"
  FileWrite $0 "  https://wa.me/5492657580979?text=Hola!%20Consulta%20sobre%20Sistema%20EXMC$\r$\n"
  FileWrite $0 "$\r$\n"
  FileWrite $0 "═══════════════════════════════════════════════════$\r$\n"
  FileWrite $0 "Copyright © 2025 Luciano Savoretti$\r$\n"
  FileWrite $0 "Todos los derechos reservados.$\r$\n"
  FileWrite $0 "═══════════════════════════════════════════════════$\r$\n"
  FileClose $0
  
  ; Crear acceso directo a Instagram
  FileOpen $0 "$INSTDIR\Instagram @devpuchito.url" w
  FileWrite $0 "[InternetShortcut]$\r$\n"
  FileWrite $0 "URL=https://www.instagram.com/devpuchito/$\r$\n"
  FileWrite $0 "IconIndex=0$\r$\n"
  FileClose $0
  
  ; Crear acceso directo a WhatsApp con mensaje automático
  FileOpen $0 "$INSTDIR\WhatsApp - Contactar.url" w
  FileWrite $0 "[InternetShortcut]$\r$\n"
  FileWrite $0 "URL=https://wa.me/5492657580979?text=Hola!%20Consulta%20sobre%20Sistema%20EXMC$\r$\n"
  FileWrite $0 "IconIndex=0$\r$\n"
  FileClose $0
  
  ; Crear accesos directos en el menú Inicio
  CreateDirectory "$SMPROGRAMS\Sistema EXMC"
  CreateShortCut "$SMPROGRAMS\Sistema EXMC\Instagram @devpuchito.lnk" "https://www.instagram.com/devpuchito/"
  CreateShortCut "$SMPROGRAMS\Sistema EXMC\WhatsApp - Contactar.lnk" "https://wa.me/5492657580979?text=Hola!%20Consulta%20sobre%20Sistema%20EXMC"
!macroend

; NO usar customInstallMode para evitar mensajes múltiples
; Los diálogos se manejan automáticamente por NSIS

!macro customInit
  ; Mensaje al iniciar el instalador
  MessageBox MB_ICONINFORMATION "Sistema EXMC v1.0.0$\r$\n$\r$\nDesarrollado por:$\r$\nLuciano Savoretti$\r$\n@devpuchito$\r$\n$\r$\nSistema de Gestión Comercial"
!macroend
