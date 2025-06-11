import JsBarcode from "jsbarcode";

export function generarCodigoBarras(codigo: string) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    JsBarcode(svg, codigo, {
        format: "CODE128",
        displayValue: true,
        width: 2,
        height: 50,
        margin: 10,
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height + 15; 

        ctx?.drawImage(img, 0, 0);

        
        if (ctx) {
            ctx.font = "10px Arial";
            ctx.fillStyle = "#999";
            const texto = "TSHM";
            const textWidth = ctx.measureText(texto).width;
            ctx.fillText(texto, canvas.width - textWidth - 15, canvas.height - 5);
        }

        // Exportar como imagen
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `${codigo}.png`;
        link.click();

        URL.revokeObjectURL(url);
    };

    img.src = url;
}