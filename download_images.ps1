Add-Type -AssemblyName System.Drawing

function Download-And-Resize {
    param (
        [string]$Url,
        [string]$OutputPath,
        [int]$MaxWidth,
        [int]$MaxHeight
    )

    $tempPath = $OutputPath + ".temp.jpg"
    try {
        Write-Host "Downloading $Url..."
        # Use a random query param to ensure fresh image
        $finalUrl = $Url + "?random=" + (Get-Random)
        Invoke-WebRequest -Uri $finalUrl -OutFile $tempPath -UserAgent "Mozilla/5.0" -TimeoutSec 30
        
        if (Test-Path $tempPath) {
            $image = [System.Drawing.Image]::FromFile($tempPath)
            
            # Calculate new dimensions to fit within MaxWidth/MaxHeight while maintaining aspect ratio
            $ratioX = $MaxWidth / $image.Width
            $ratioY = $MaxHeight / $image.Height
            $ratio = 1.0
            if ($ratioX -lt 1.0 -or $ratioY -lt 1.0) {
                 $ratio = if ($ratioX -lt $ratioY) { $ratioX } else { $ratioY }
            }
            
            $newWidth = [math]::Round($image.Width * $ratio)
            $newHeight = [math]::Round($image.Height * $ratio)
            
            $newImage = new-object System.Drawing.Bitmap $newWidth, $newHeight
            $graph = [System.Drawing.Graphics]::FromImage($newImage)
            $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graph.DrawImage($image, 0, 0, $newWidth, $newHeight)
            
            $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
            $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            # Set quality to 60 to ensure < 100kb
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 60) 
            
            $newImage.Save($OutputPath, $codec, $encoderParams)
            
            $image.Dispose()
            $newImage.Dispose()
            $graph.Dispose()
            $codec = $null
            $encoderParams = $null
            
            Remove-Item $tempPath -Force
            
            $fileItem = Get-Item $OutputPath
            $sizeKb = [math]::Round($fileItem.Length / 1024, 2)
            Write-Host "Success: $OutputPath ($sizeKb KB)"
        } else {
            Write-Error "Download failed for $Url"
        }
    }
    catch {
        Write-Error "Error processing $Url : $_"
        if (Test-Path $tempPath) { Remove-Item $tempPath -Force }
    }
}

$imagesDir = "c:\Users\Lenovo\bank\images"
if (!(Test-Path $imagesDir)) { New-Item -ItemType Directory -Path $imagesDir }

# Hero Image - Luxury House
Download-And-Resize -Url "https://loremflickr.com/1024/768/luxury,house,modern" -OutputPath "$imagesDir\hero_realestate.jpg" -MaxWidth 1024 -MaxHeight 768

# App Image - Smartphone
Download-And-Resize -Url "https://loremflickr.com/800/600/smartphone,hand,technology" -OutputPath "$imagesDir\mobile_realestate.jpg" -MaxWidth 800 -MaxHeight 600

# Trust Image - Keys
Download-And-Resize -Url "https://loremflickr.com/800/600/keys,house" -OutputPath "$imagesDir\trust_realestate.jpg" -MaxWidth 800 -MaxHeight 600
