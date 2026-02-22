$file = 'c:\Users\Usuario\Documents\code\zeenix\frontend\src\views\Admin\StrategyCreatorView.vue'
$lines = [System.IO.File]::ReadAllLines($file)
$newLines = $lines[0..1227] + $lines[1784..($lines.Length - 1)]
[System.IO.File]::WriteAllLines($file, $newLines)
Write-Host ('Done. New line count: ' + $newLines.Length)
