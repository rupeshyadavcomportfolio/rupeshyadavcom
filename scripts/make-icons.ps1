Add-Type -AssemblyName System.Drawing

$srcPath = "c:\RUPESH YADAV COM PORTFOLIO\public\rupesh-yadav.png"
if (-not (Test-Path $srcPath)) {
    Write-Error "File not found: $srcPath"
    exit 1
}

$img = [System.Drawing.Image]::FromFile($srcPath)

# Source is 1086 width x 1448 height.
# Crop a square around face: width 1086, height 1086, starting from Y = 60
$cropSize = 1086
$cropX = 0
$cropY = 60

$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropSize, $cropSize)
$cropped = New-Object System.Drawing.Bitmap($cropSize, $cropSize)
$g = [System.Drawing.Graphics]::FromImage($cropped)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $cropSize, $cropSize)), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

function ResizeAndSave($source, $path, $w, $h, $format) {
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $bg = [System.Drawing.Graphics]::FromImage($bmp)
    $bg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $bg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $bg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $bg.DrawImage($source, 0, 0, $w, $h)
    $bg.Dispose()
    
    # Save file
    $dir = [System.IO.Path]::GetDirectoryName($path)
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    if (Test-Path $path) {
        Remove-Item $path -Force
    }
    $bmp.Save($path, $format)
    $bmp.Dispose()
    Write-Output "Generated: $path ($w x $h)"
}

ResizeAndSave $cropped "c:\RUPESH YADAV COM PORTFOLIO\src\app\icon.png" 512 512 ([System.Drawing.Imaging.ImageFormat]::Png)
ResizeAndSave $cropped "c:\RUPESH YADAV COM PORTFOLIO\src\app\apple-icon.png" 180 180 ([System.Drawing.Imaging.ImageFormat]::Png)
ResizeAndSave $cropped "c:\RUPESH YADAV COM PORTFOLIO\public\icon.png" 192 192 ([System.Drawing.Imaging.ImageFormat]::Png)
ResizeAndSave $cropped "c:\RUPESH YADAV COM PORTFOLIO\public\apple-touch-icon.png" 180 180 ([System.Drawing.Imaging.ImageFormat]::Png)
ResizeAndSave $cropped "c:\RUPESH YADAV COM PORTFOLIO\public\favicon.ico" 64 64 ([System.Drawing.Imaging.ImageFormat]::Icon)
ResizeAndSave $cropped "c:\RUPESH YADAV COM PORTFOLIO\src\app\favicon.ico" 64 64 ([System.Drawing.Imaging.ImageFormat]::Icon)

$cropped.Dispose()
$img.Dispose()
Write-Output "All icons successfully created!"
