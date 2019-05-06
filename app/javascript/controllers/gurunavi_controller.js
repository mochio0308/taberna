import { Controller } from "stimulus"
import axios from "axios"

let location = {
    lati: 0.0,
    long: 0.0
}

export default class extends Controller {
  static targets = [ "results" ]

  connect() {
    this.getLocation();
    console.log(location);
  }
  
  search() {
    const url = `https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=${process.env.GURUNAVI_API}&latitude=${location.lati}&longitude=${location.long}`
    axios.get(url).then(response => {
        this.resultsTarget.innerHTML = ""
        for (let i = 0; i < response.data.rest.length; i++) {
            this.resultsTarget.innerHTML += `
                                            <div class="card">
                                              <div class="card-body">
                                                <h5 class="card-title">${response.data.rest[i].name}</h5>
                                                <p class="card-text">住所:${response.data.rest[i].address}</p>
                                                <p class="card-text">営業時間:${response.data.rest[i].opentime}</p>
                                                <p class="card-text">定休日:${response.data.rest[i].holiday}</p>
                                                <a href="${response.data.rest[i].url}" class="btn btn-primary">詳細</a>
                                              </div>
                                            </div>
                                            `
          console.log(response.data.rest[i]);
        }
    }, false)
  }
  
  getLocation() {
    navigator.geolocation.getCurrentPosition(
        position => {
          location.lati = this.round(position.coords.latitude, 8)
          location.long = this.round(position.coords.longitude, 8)
        },
        error => {
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              alert('位置情報の利用が許可されていません')
              break
            case 2: // POSITION_UNAVAILABLE
              alert('現在位置が取得できませんでした')
              break
            case 3: // TIMEOUT
              alert('タイムアウトになりました')
              break
            default:
              alert('その他のエラー(エラーコード:' + error.code + ')')
              break
          }
        }
      )
    }
    
    round(number, precision) {
      const shift = function(number, precision, reverseShift) {
        if (reverseShift) {
          precision = -precision
        }
        const numArray = ('' + number).split('e')
        return +(
          numArray[0] +
          'e' +
          (numArray[1] ? +numArray[1] + precision : precision)
        )
      }
      return shift(Math.round(shift(number, precision, false)), precision, true)
    }
}
