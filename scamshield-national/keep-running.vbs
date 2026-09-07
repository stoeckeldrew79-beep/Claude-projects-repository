' Makes sure the site is actually up, and silently starts whatever isn't.
'
' auto-update.bat keeps the CONTENT fresh; this keeps the SITE ALIVE. Content
' syncing perfectly is worth nothing while the backend is stopped - the site
' then shows "This site can't be reached", which looks identical to the site
' being broken.
'
' Runs every 5 minutes and at logon (see setup-auto-updates.bat), so the site
' comes back on its own after a reboot, a crash, or a window being closed.
'
' Written in VBScript rather than a .bat because starting a long-running
' server that is both hidden AND detached is the one thing batch is bad at:
' it needs nested quotes inside "start /b cmd /c", which breaks on any path
' containing a space. shell.Run takes the window style and the wait flag as
' real arguments, so there is nothing to escape.
'
' Safe to run at any time: it starts only what is not already listening, so
' running it twice never leaves you with two copies of a server.

Option Explicit

Dim fso, shell, scriptDir, logFile
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
logFile = scriptDir & "\keep-running-log.txt"

Sub Log(message)
    Dim f
    On Error Resume Next
    Set f = fso.OpenTextFile(logFile, 8, True)   ' 8 = append, True = create
    If Err.Number = 0 Then
        f.WriteLine Now & "  " & message
        f.Close
    End If
    On Error Goto 0
End Sub

' True when something is already listening on the port. Uses netstat because
' VBScript has no socket API. Two chained literal searches rather than one
' regex: findstr's /R and /C: interact badly, and ":3000 " with the trailing
' space is what stops port 30000 matching as well.
Function PortListening(port)
    Dim exec, cmd
    cmd = "cmd /c netstat -ano | findstr /C:""LISTENING"" | findstr /C:"":" & port & " """
    Set exec = shell.Exec(cmd)
    Do While exec.Status = 0
        WScript.Sleep 100
    Loop
    PortListening = (exec.ExitCode = 0)
End Function

' 0 = hidden window, False = do not wait. Both matter: hidden so no console
' flashes up every 5 minutes, and not waiting so the server keeps running
' long after this script exits.
Sub StartHidden(workingDir, command)
    shell.CurrentDirectory = workingDir
    shell.Run "cmd /c " & command, 0, False
End Sub

' Postgres and Redis run in Docker. "up -d" is idempotent - it starts them if
' they are down and does nothing if they are already up. Best effort: right
' after a reboot Docker Desktop may not be ready yet, and the next 5-minute
' run picks it up.
StartHidden scriptDir, "docker compose up -d"

If PortListening(3000) Then
    Log "backend already running"
Else
    Log "backend not listening - starting it"
    StartHidden scriptDir & "\backend", "npm run dev"
End If

If PortListening(5173) Then
    Log "frontend already running"
Else
    Log "frontend not listening - starting it"
    StartHidden scriptDir & "\frontend", "npm run dev"
End If
