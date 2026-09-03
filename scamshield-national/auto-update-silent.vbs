' Runs auto-update.bat completely invisibly (no window, no flicker).
' Used by the scheduled task created in setup-auto-updates.bat - you
' shouldn't need to run this file directly.
Dim fso, shell, scriptDir
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.Run """" & scriptDir & "\auto-update.bat""", 0, True
