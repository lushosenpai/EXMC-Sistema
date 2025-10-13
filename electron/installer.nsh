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
  FileWrite $0 "           SISTEMA EXMC v2.0.0$\r$\n"
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
  FileWrite $0 "DEBUG / LOGS:$\r$\n"
  FileWrite $0 "  Para ver logs: Menu Inicio > Sistema EXMC > Ver Logs (Debug)$\r$\n"
  FileWrite $0 "  O lee: COMO-VER-LOGS.txt en la carpeta de instalacion$\r$\n"
  FileWrite $0 "$\r$\n"
  FileWrite $0 "═══════════════════════════════════════════════════$\r$\n"
  FileWrite $0 "Copyright © 2025 Luciano Savoretti$\r$\n"
  FileWrite $0 "Todos los derechos reservados.$\r$\n"
  FileWrite $0 "═══════════════════════════════════════════════════$\r$\n"
  FileClose $0
  
  ; Configurar firewall de Windows
  DetailPrint "Configurando reglas de firewall..."
  nsExec::ExecToLog 'netsh advfirewall firewall add rule name="Sistema EXMC" dir=in action=allow program="$INSTDIR\Sistema EXMC.exe" enable=yes profile=any'
  nsExec::ExecToLog 'netsh advfirewall firewall add rule name="Sistema EXMC Backend" dir=in action=allow protocol=TCP localport=3001 profile=any'
  nsExec::ExecToLog 'netsh advfirewall firewall add rule name="Sistema EXMC PostgreSQL" dir=in action=allow protocol=TCP localport=5433 profile=any'
  
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
  CreateShortCut "$SMPROGRAMS\Sistema EXMC\Sistema EXMC.lnk" "$INSTDIR\Sistema EXMC.exe"
  CreateShortCut "$SMPROGRAMS\Sistema EXMC\Ver Logs (Debug).lnk" "$INSTDIR\resources\app.asar.unpacked\electron\ver-logs.bat" "" "$INSTDIR\Sistema EXMC.exe" 0 SW_SHOWNORMAL "" "Ver logs de depuración"
  CreateShortCut "$SMPROGRAMS\Sistema EXMC\Instagram @devpuchito.lnk" "https://www.instagram.com/devpuchito/"
  CreateShortCut "$SMPROGRAMS\Sistema EXMC\WhatsApp - Contactar.lnk" "https://wa.me/5492657580979?text=Hola!%20Consulta%20sobre%20Sistema%20EXMC"
!macroend

; NO usar customInstallMode para evitar mensajes múltiples
; Los diálogos se manejan automáticamente por NSIS

!macro customInit
  ; Mensaje al iniciar el instalador
  MessageBox MB_ICONINFORMATION "Sistema EXMC v2.0.0$\r$\n$\r$\nDesarrollado por:$\r$\nLuciano Savoretti$\r$\n@devpuchito$\r$\n$\r$\nSistema de Gestión Comercial con Licencias"
!macroend

!macro customUninstall
  ; Eliminar reglas de firewall
  DetailPrint "Eliminando reglas de firewall..."
  nsExec::ExecToLog 'netsh advfirewall firewall delete rule name="Sistema EXMC"'
  nsExec::ExecToLog 'netsh advfirewall firewall delete rule name="Sistema EXMC Backend"'
  nsExec::ExecToLog 'netsh advfirewall firewall delete rule name="Sistema EXMC PostgreSQL"'
!macroend
