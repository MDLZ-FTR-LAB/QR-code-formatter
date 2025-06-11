const canvas = document.getElementById("polaroidCanvas");
const ctx = canvas.getContext("2d");

const imageInput = document.getElementById("imageInput");
const captionInput = document.getElementById("caption");

let uploadedImage = null;
let backgroundImage = new Image();
backgroundImage.src = 'assets/background.png';

imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
        const img = new Image();
        img.onload = function() {
            uploadedImage = img;
            document.fonts.ready.then(drawPolaroid);
        };
        img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    }
});

captionInput.addEventListener("input", () => {
    document.fonts.ready.then(drawPolaroid);
});


function drawPolaroid() {
    if (!backgroundImage.complete) {
        backgroundImage.onload = drawPolaroid;
        return;
    }

    // Draw background frame image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // If image is uploaded, draw it
    if (uploadedImage) {
        const photoX = 50;
        const photoY = 50;
        const photoWidth = 400;
        const photoHeight = uploadedImage.height * (photoWidth / uploadedImage.width);
        ctx.drawImage(uploadedImage, photoX, photoY, photoWidth, photoHeight);
    }

    // Always draw caption (even if it's empty or no image)
    ctx.font = "40px 'MDLZ'";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    const caption = captionInput.value;
    const maxTextWidth = 400;
    const words = caption.split(" ").filter(w => w.length > 0);
    let lines = [];

    if (words.length > 0) {
        let currentLine = words[0];
        for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + " " + words[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width < maxTextWidth) {
                currentLine = testLine;
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);
    }

    const startY = canvas.height - 70;
    lines.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, startY + i * 40);
    });
}

function downloadImage() {
    let caption = captionInput.value.trim();

    // Fallback name if caption is empty
    if (!caption) caption = "polaroid";

    // Sanitize filename: remove illegal characters
    const safeFilename = caption.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();

    const link = document.createElement('a');
    link.download = `${safeFilename}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

document.fonts.ready.then(drawPolaroid);
