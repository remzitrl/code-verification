from flask import Flask, render_template, request, redirect, url_for, jsonify
import secrets #Random doğrulama kodu oluşturmak için kullanıyoruz 
#Flask kütüphanesini ekliyoruz Phyton kodunu web arayüzüne aktarmasına yarar 
app = Flask(__name__) 
single_user = {'berat': '1234'}
active_sessions = {} 
#kullanıcı adı ve şifre tanımalası

@app.route('/')# phyton kodu çalıştığında ilk önce bu fonksiyon çalışır
def index():
    return render_template('index.html') 
#Web sitesi arayüzüne yönlendirmeye yarar 

@app.route('/giris', methods=['POST'])#web sitesinde giriş butonuna tıkladığımızda bu fonksiyon çalışır 
def giris():
    try:
        data = request.get_json() #web sitesine yazdığımız kullanıcı adı ve şifre bilgisini json veri formatında alır
        kullanici_adi = data.get('kullanici_adi')
        sifre = data.get('sifre')
#kullanıcı ve şifreyi alıp data ile ayrıştırır 
        if kullanici_adi in single_user and single_user[kullanici_adi] == sifre:
            dogrulama_kodu = generate_verification_code()
            active_sessions[kullanici_adi] = {'dogrulama_kodu': dogrulama_kodu}
#if fonksiyonu ile kullanıcı adı ve şifreyi doğru olup olmadığını kontrol ettikten sonra generate_verification_code() doğrulama kodunu oluşturuyoruz
# return jsonify json ile arayüz tarafına aktarıyoruz 
            return jsonify({'dogrulama_kodu': dogrulama_kodu})

        return jsonify({'error': 400}), 400
    except Exception as e:
        return jsonify({'error': f'Hata oluştu: {str(e)}'}), 500
#doğrulama kodu hatalı ise hata oluştu yazısını verir

#arayüz tarafında doğrula butonuna tıkladığımızda bu fonksiyon çalışır  
@app.route('/dogrula', methods=['POST'])
def dogrula():
    kullanici_adi = request.form['kullanici_adi']#arayüz tarafından kullanıcı adı alınır 
    dogrulama_kodu_kullanici = request.form['dogrulama_kodu']#arayüz tarafından kullanıcının girmiş olduğu doğrulama kodu alır

    dogrulama_kodu_server = active_sessions.get(kullanici_adi, {}).get('dogrulama_kodu')
#Phyton tarafından üretilen doğrulama kodunu alıyoruz 
    if dogrulama_kodu_server == dogrulama_kodu_kullanici:
        return "1"
    else:
        return "0"
#kullanıcının yazdığı ve Phyton tarafından üretilen kodun doğruluğunu kontrol eder 

@app.route('/yenikod', methods=['POST']) #Yeni kod tuşuna bastığımız zaman yeni kod üretir arayüze gönderir
def yenikod():
    kullanici_adi = request.form['kullanici_adi']
    dogrulama_kodu = generate_verification_code()
    active_sessions[kullanici_adi] = {'dogrulama_kodu': dogrulama_kodu}
    return jsonify({'dogrulama_kodu': dogrulama_kodu})

def generate_verification_code():#Random doğrulama kodu oluşturur 
    return str(secrets.randbelow(1000000)).zfill(6)#6 haneli olduğunu belirler 

if __name__ == '__main__':
    app.run(debug=True)#debug hataları kontrol eder 
#Fonksiyonu çalıştırır 