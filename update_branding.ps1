$srcImg = "c:\Users\DELL\Downloads\NN2all.in take thiss\2all.in take thiss\public\favicon.jpeg"

Remove-Item -Path "c:\Users\DELL\Downloads\NN2all.in take thiss\2all.in take thiss\public\images\logo.png" -ErrorAction SilentlyContinue

Copy-Item -Path $srcImg -Destination "c:\Users\DELL\Downloads\NN2all.in take thiss\2all.in take thiss\public\images\logo.jpeg" -Force
Copy-Item -Path $srcImg -Destination "c:\Users\DELL\Downloads\NN2all.in take thiss\2all.in take thiss\src\app\opengraph-image.jpeg" -Force
Copy-Item -Path $srcImg -Destination "c:\Users\DELL\Downloads\NN2all.in take thiss\2all.in take thiss\src\app\twitter-image.jpeg" -Force

Get-ChildItem -Path "c:\Users\DELL\Downloads\NN2all.in take thiss\2all.in take thiss\src" -Recurse -File | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName)
    if ($content -match "/images/logo\.png") {
        $newContent = $content -replace "/images/logo\.png(\?v=[0-9]+)?", "/images/logo.jpeg"
        [System.IO.File]::WriteAllText($_.FullName, $newContent)
        Write-Output "Updated: $($_.FullName)"
    }
}
