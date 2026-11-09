# Banco Arcade — Supabase

## Modo de evento
El modo global se almacena en `public.configuracion_evento` y se consulta mediante `obtener_modo_evento()`. El valor inicial es `viernes`.

## Sábado
- `competencias`: nombre y base asignada.
- `enfrentamientos`: equipos A/B, PP para ganador/perdedor y resultado único.
- `cuentas_pp`: saldo actual por equipo.
- `movimientos_pp`: libro separado para premios de competencia y reclamaciones.
- Las tablas tienen RLS habilitado y no conceden acceso directo a `anon` ni `authenticated`; las operaciones pasan por RPC.

## RPC de sábado
- `consultar_equipo_sabado`
- `consultar_enfrentamientos_equipo`
- `registrar_resultado_competencia`
- `reclamar_todo_pp`
- `cambiar_modo_evento`
- `admin_listar_sabado`
- `guardar_competencia`
- `guardar_enfrentamiento`
- `cambiar_clave_admin`

Los resultados bloquean la edición de la rotación y el cambio de modo. El cambio de viernes a sábado también se rechaza si quedan cobros del viernes sin tickets registrados.

## Limpieza aplicada
Se retiraron físicamente G11–G14, sus tarjetas NFC y las bases 111–114, tras comprobar que no tenían movimientos. G15 y la base 115 se conservaron por su historial, pero quedaron inactivos.

## Historial remoto
Las migraciones fueron aplicadas al proyecto Supabase `ecuxshgbftpnurcfviir` el 9 de noviembre de 2026:
- `limpieza_equipos_y_base_modo_sabado`
- `rpc_operaciones_modo_sabado`
- `administracion_sabado_y_modo_global`
- `bloqueo_modo_y_rotacion_clave_admin`
- `validar_cambio_modo_y_resultado`

Este documento resume la estructura y las reglas. El historial autoritativo de ejecución permanece en Supabase.
