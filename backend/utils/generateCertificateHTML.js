exports.generateCertificateHTML = (user, roadmap, date) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Certificate</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Libre+Baskerville:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=poppins&family=Libre+Baskerville:wght@400;700&display=swap');


        body {
        scale:0.9;
          margin: 0;
          padding: 0;
          background: #f2f2f2;
          font-family: 'Libre Baskerville', serif;
          display:flex;
          justify-content: center;
          
        }

        .certificate {
          width: 90%;
          max-width: 1000px;
          margin: 50px auto;
          padding: 60px;
          background: #fff;
          border: 15px solid rebeccapurple;
          border-radius: 20px;
          position: relative;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .certificate::before {
          content: "";
          position: absolute;
          top: 30px;
          left: 30px;
          right: 30px;
          bottom: 30px;
          border: 5px double rebeccapurple;
          border-radius: 10px;
          z-index: 0;
        }

        .content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .title {
          font-size: 48px;
          font-weight: bold;
          color: rebeccapurple;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }

        .subtitle {
          font-size: 20px;
          color: #666;
          margin-bottom: 50px;
        }

        .name {
          font-family: 'poppins', cursive;
          font-size: 60px;
          color: #2c3e50;
          margin: 20px 0;
        }

        .description {
          font-size: 20px;
          color: #444;
          margin: 20px 0;
        }

        .roadmap-title {
          font-size: 26px;
          font-style: italic;
          font-weight: 600;
          color: #555;
          margin-bottom: 30px;
        }

        .footer {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 50px;
          color: #888;
        }

        .footer .date,
        .footer .signature {
          font-size: 16px;
          font-style: italic;
        }

        .signature-line {
          border-top: 1px solid #aaa;
          width: 200px;
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="content">
          <div class="title">Certificate of Completion</div>
          <div class="subtitle">This is to proudly certify that</div>
          <div class="name">${user.name}</div>
          <div class="description">has successfully completed the roadmap</div>
          <div class="roadmap-title">"${roadmap}"</div>

          <div class="footer">
            <div class="date">
              completed on: ${date}
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <div>Authorized Signature</div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
