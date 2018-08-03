<template>
  <div id="agreeMore">
    <div class="hello">
      <div id="title" v-title data-title="申请详情"></div>
      <div class="labelBox">
        <p>申请司机信息</p>
        <div class="label">
          <span style="float: left;">姓名</span>
          <div class="companyNameBox" >{{name}}</div>
        </div>
        <div class="label">
          <span style="float: left;">手机</span>
          <div class="companyNameBox" >{{phone}}</div>
        </div>
        <div class="label" style="height: auto;border:none">
          <h1><h5 style="margin-left: 0;">身份证</h5></h1>
          <div style="margin-left: 0.18rem;margin-top: 0.3rem;">
            <img :src="IDpic" onerror='src="data:image/jpeg;base64,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"'>
            <h5 style="font-size: 0.3125rem;text-align: center;width:4rem;">正面</h5>
          </div>
        </div>
        <div class="label" style="height: auto;border:none">
          <span>证件</span>
          <div class="clearBoth"></div>
          <div class="imgBoxBigs" style="float: left;margin-left: 0.18rem; ">
            <img :src="Drivepic" onerror='src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMgIyIoLTkwKCo2KyIjMkQyNjs9QEBAJjBGS0U+Sjk/QD3/2wBDAQsLCw8NDx0QEB09KSMpPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT3/wgARCAGIAlgDAREAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAQFAQIDBgf/xAAaAQEAAgMBAAAAAAAAAAAAAAAABAUCAwYB/9oADAMBAAIQAxAAAAD7MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADBwi7eETZpryz6679cmbq32YgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADBCq5NdTy+UfMADPvkuy0Wd1D678AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANMPajnZ8WBvAAAA2z8tuggTLHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAABrj7S8zYR4e4AAAAB6uOjr5lhoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFXRzK+nlgASrDRLn6NNeUCplaasgBtn5fdZV9NuIAAAAAAAAAAAAAAAAAAAAAAAAAAAA5acqHkrTHnoAmWce0vYUGpk95WvpI10XKWjwAJ9tFtb6EAAAAAAAAAAAAAAAAAAAAAAAAAAAAK6ml1lJMAAuelr4lfug1UrOXnouxqfP8laaacwBtn56Dr6rbLwAAAAAAAAAAAAAAAAAAAAAAAAAAACl5qxiwNwAHTfhpqyxj7Knabboq/wA/yNqx9AAu+orZMzUAAAAAAAAAAAAAAAAAAAAAAAAAAABQcnaco+YAAHeXquulr6fnZ8aDuAAFv0UCbZRwAAAAAAAAAAAAAAAAAAAAAAAAAAAKDk7TlHzAAAverrK+nlwqyQAABb9DAm2ccAAAAAAAAAAAAAAAAAAAAAAAAakAwAAQuYseULcAAM5+ei7Cp87x9tjD0AAC76eukzdIAAAAAAAAAAAAAAAAAAAAAAAAGhzIR3JQK+lmV1LLAAAkTNUeHtAAAzl56HsKrbLwAAAAAAAAAAAAAAAAAAAAAAcSGAAYMA2BpHzgcpaPAAHeXqvepraXmrGLA3AACZZx7joYAAAAAAAAAAAAAAAAAAAAAAAGDUAwV4JJIABV8/OhVckAB6l2GiLA3Yx9AAzl5e9VWdpGAAAAAAAAAAAAAAAAAAAAAAAAGhABqDJkGxYGmHtHy1lyj7AAAAABa38GfaxgAAAAAAAAAAAAAAAAAAAAAAAANAAADJsDnpypebseMXYAAAA9Wl7CsLaKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABrj7XU8uBUStcPQABImarS9hSJeoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa4+w66RU89O7y9UiXq678JM7T3k6wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEgb5EvVvsxAAAgmAAAdiSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcjUhAmmwNjcAAAAAAAAAAAAAAAAAAAAAAAAAAAAh1++LX77S+hbZeAQTAAMHMHQyAdSUAAAAAAAAAAAAAAAAAAAAAAAAAAACup5cCpk3HSV8iVrA5AGCGanQlgAGxuAAAAAAAAAAAAAAAAAAAAAAAAAAAActGfXfgABoRQcgZOgBJOgAAAAAAAAAAAAAAAAAAAAAAAAAAAABph7BqpM60j77MQMHAAAAHY2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAOerKo56fc9HX7Z+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADHh6yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVlJM5aM7jooAFVKq4O+FfQLzrjtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhVkjnqzsLeJSSI1lhn5+x53n7rnaZtzTdH2ka8+gAAAAAAAAAAAAAAAAAAAAAAAAAAAABF2apWvaMFBYUMTbE9FXdDJ1yMHlptdW2HMSMN8yNNl8J28u5hWVjpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHl7Ko5+ZeprrSLuiUM+i0yw7690TdF55a/R1vReAt+atPNdjFtIfkz0MSfcRpgAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5ZYfLem5CDjsuIcqzzrOuGzhs0WUWy2ews8Y0itqMtvLfjZaJ30fnuqyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVEqF836LlsMZ+nyRh50xdsfdfVNty75YxNnsfDd9a5zq5mreAAAAAAAAAAAAAAAAAAAAAAAAAAAAABg0KWXC8He81H26Rkz4x6GCwjy/fUPSRy80SQAAAAAAAAAAAAAAAAAAAAAAAAAAABwNDqRTkDllh5+zqKWfWQpEXX3zfHKwjTL2utLyvtdvPdiQdTqAAAAAAAAAAAAAAAAAAAAAAAAAAADkaHU3MHEhglGQZBsbGxzNDqbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHI5kAtCrBII5sSjuRjiTiOZJhUnI3LgjnMmgAAAAAAAAAAAAAAAAAAAAAAAAAoSjKg+gkY8YfQjwRMIB6Q8YegLEqyvPcnmjzx6E9ofPyQe2OwAAAAAAAAAAAAAAAAAAAAAAAAB50jnlz3xSnMlGhk8+egPLHriKcShPeHnylLc9aeRJh68AAAAAAAAAAAAAAAAAAAAAAAAAFORTkTy4KEvjyx0Ip6U82bEg5luQSAakYuy8KMvgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//xABREAABAwMABwUFAwYICgsAAAABAgMEAAURBhITITFRUhQiQZGhECBQYXEwMmAVFkJVYoEHIzdTcpTB0SQzNDZWdYCTsbRDY3CCg5Wis9Lh8P/aAAgBAQABPwD/AGBXJrDfFwE8hvpV2aH3ULNflf8A6n/1ULunxaPnSLmwriVJ+opDqHRlCwr6H8CSLkhvKWu+rn4U7JdfPfWSOXh7ySUnKSQeYpi5uN7nO+n1pmQ2+nLavqPEfgBbiWkFazgCpU5b5KU91vlz+yQtTawpBIIqHOD/AHF7nP8Aj8eUoJSSo4AqZLMlfJA4D7QEg5FQZnaEaq/8Yn1+O3OTk7FB3Der3o9vdfGse4nmaFpa8VrpdpGP4tzzp1lbC9VxOD7rbimnAtBwRTDqX2krT4/G33Qywpw+ApRKlEneTvPu22KHllxYyhHqaddQy2VrOAKVdulrd8zUaeh9WoQULqXHEhgp/SG9J+fvWt/VdLR4K3j6/G7s7uQ3z3n3raAISfmTmrqsl5KPADPsSSlQI4g5oU+Al9wDgFH3W1ltxKxxSc0lQUkKHAjPxq4r1piv2QB7zUh1kENrIBpS1LUVLJJPifZBil9wKO5tJ3mnnQyypxXBIokkkneT70BevDb+W741KOZbv9I/YQ4pku8kDiaAQy14JQkVNlmSvA3Np4e/ajmIfko/GpQxKd/pH7CIyGI6U+PE/WrjKLjpaSe4n1P2FqGIp+az8TUSEkjiBRecJ++qtq51q862rnWrzraudavOtq51q862rnWrzqTnbEnx3++jGunPDNZwM0s6y1HmfsLejVho+e/4oW0HeUJ8qeab2SjqgEeyKhK1K1t+OArZN9CfKtk30J8qurWNm4P6P2HZ5Ra+65qcv/r7BKStQSOJOBSEBCEpHADHw+QtSGspraudavOtq51q862rnWrzraudavOtq51q86K1K4qJ+p9gJByDitq51q862rnWrzp0qdbKSon34KUqmIC/ZcQkTFaviAT9fftjOu/rngj/AI/Edk30J8q2TfQnyrZN9CfKlNNlJylI+ePbEbQoEqAJrZN9CfKtk30J8q2TfQnyrZN9CfKrjF2Tm0QO4r0PvAkEEbjQub4Rju/XG+lKKlFSjkn3kpK1BKRkmozAjsBHj4n5/EnVFLSinjW1c61edFxZGCtXn7Qop4Eitq51q862rnWrzpDzgUMKJ9jjaXUFCxkGpMdUZ0pPDwPP7W3w9kNq4O+eA5fFNkjoT5Vsm+hPlWyb6E+VbJvoT5Vsm+hPlWyb6E+VbJvoT5UG0A5CUj2vMofbKFipMRcZXe3p8FfZAEnA3moVv1MOPDveCeX4AUkLSUqAIPgakWvipg/900ttbasLSUn5++xBef8ADVTzNRobcbeN6+o/gNSErGFpCh86ftzJbUpAIUASAD7I0NySFFBSAOdC0ueLiKRaUD77hP0GKaiMs70IGeZ3/gdy3MOLKt6c8jTbSGUBCBgD7BUpwqODgV2l3r9BXaXev0Fdpd6/QV2l3r9BXaXev0Fdpd6/QVGeU4SlW/8AAimG1EkppUVspOBg+1MVsJGRk12Zrp9TXZmun1NIbS2O6MfGrg64y2hbZxhW+l3R1aQlCQk86RnUGd5xv9xUpwqODgV2l3r9BXaXev0Fdpd6/QV2l3r9BSn3FAgq9qX3EjAVXaXev0Fdpd6/QV2l3r9BUd9a3NVW/PxmaxJfWcAag4AGmWFvr1EDeKiIebb1XiDjh7imG1EkprszXT6muzNdPqa7M10+tOoDbikj2MNh1zB4V2Zrp9TXZmun1Ndma6fU12Zrp9TXZmun1NIaQ391OPjTMdDKlqRxWcn3nF7NBVyrti+Sa7YvkmisE5KE+v8AfWuP5tPr/fSXNU5CEg/v/vrtjnJNdsc5JrtjnJNMubVGfji3ENJytQSPnSLkkSVhZ/iv0TTTqXka6OHuFIUCDvBrsbfNVdjb5qrsbfNVdjb5qrsbfNVdjb5qrsbfNVdjb5qpCA2nVT8cebQ62QtIUKTAfU3rhP7jxpH3E7sbuHL8E5/Bdyc1H0FteFgVEkFyYlT7n09y43tuIstNAOOjjyFM6Su642zSNT9jOajyG5TIdZVlJ/Aj9vbUhaka2vxG+olvQWQp5J1j4UAEgAVdX5tom/lJBXJt5ATJY8WR1o/tFLlodti5UZxLiC0VoWngd1W63Mzo77zz5QtJ/wDxNWm3tT3HA86UagyAOJrR9ZbmyY6V6yACQfocZp6Uhl1tCv0/SgQfjrc9lye9Ezh5oA4PiCOI9y4X9QcLcPGBuKzTN/moXlxYcTyKQKhTG5zAdb+hHiD7biw7oyiS9EQV2l9KtswOMZR/TSOnmKYU05qrUolojOUeI+VOOxHUYRHUyrwUFlXmK0dGZroyRlo7x9RUlpaZCkFRcI8atS2yXUDO0SAVE/PO70+O6YxXWkMXOKSh1k4UpNWnTdhYS1dcML8Hv0D9eVNuIebC2lpWhW8KScg1dnFNWt9aDg4A9atj1vbjPCY3rOHhuzu+XKrS7CaccM1AII7uU5FWma3Fky1jIZCCpKf37qlSZc7Wec1y2D4A6qaiuSWlFyNtO5vUUgkD60mamfY5C8d7ZLCx88GiFWZwkZMBZ3j+ZP8A8aBCkgpIIO8EVZZkeBIeflvIZaDRypZwOIq7aZB8LbtKChK+L6hhSvoK0ZhLh2dsvEl13vqz8dkMNyozjDoyhxJSRV0tzlsnOxXhw4HqTTDs+2LLlpmOMc289w/uqFptdJ6xbLiw0dru2gGDu30ytDa9ZbYcxwSeH76elIfTvjtNq8FNDV8xQOARzqHOfcgKgMMBZIPe5A1HmSbMytlyOO/vSSaYvcO2MPRZS1B2YNRkBOcnh/aKKQpJSoAg7iDRe/Ij2oSVwlcObJ5fSp74mFIUAUJOskfPnWjFnN0uQU4D2dkhS/nyHx/SGxovETu4Ehve2r+w08y5HeW08gocQcFJpCy2sLT95PA01dVDc4kH5ik3NgjfkUiWy4RhfnQkp1CkODVO8jNGY2lBQXRq8cVdNSVPhPIXujr1j894NO3Ja9yNwpatoCF7weINRWVNyEMFQTGWsAOr4NZOO8eVWy3M2uEiOxwG8q6jz+Pl5tPFYq+2iHeG9bOpJSO64B6GpkB+A8W5CCnkfA+0Vn5+5a7NIujoCO414uK4CoNnt0W3LhhCHG3Rh3X4uVaWZtom/k1YXJgEFUZ/xaHQv+w/G3JSEEjBJFdt/Y9abeDoIRuVjxp1t7PfBPtfjtSWi2+2laD4GpuiSTlUJ3V/YXUiyT42deOsjmjeKUhaNy0lP1HsQy479xtavoM1G0euEn/oS2Oa91QNFY7GFylF5XTwTSEJbQEoSEpHACgM0hxbZ3Eiu2jo9aaeS7wyD8ZWwhw5I312NvmqkNIb+6PYUg8QDTzQ1CUNpJogjiCKCVK4AmkRElAK8hVdjb5qrsbfNVdkb5qrsjfI0IzXTQZbHBAoADgKWwhw5I312NvmqkNIb+6P+06Q+iLGdfd3IaQVq+gGTUOczOtzU1gksOthxJIwdUjNI0pti41ufLy0NXFeowtSCATyJ8KffajMLefcS202kqWtRwEgeJr87rB+uYH+/TX53WD9cwP9+moN+tdyfLMG4RZDoGsUNOBRxUnSyxw5LjEi6Rm3mzhaCreDUPSmyz5SI0S5R3n17koQreauF1jWyKmRJWdmpxLQKRnvKOBUh9EWM6+7uQ0grV9AMmkXiCq1M3JcltiI8hK0uPKCBg8ONfnRYv11bf60io0piawl+K+0+yv7rjSwpJwcHBFPXeHHuzFted1JUhBW0kg4UByPDNXa7RbJblzZqillBA3DJJJwMCknWSDvGedStK7JBkrjyrnGaebOFoUreK/PXR39cRKY0usMl9thi6xluuqCEIC95JokJSSeA3moE+NdITcuE8HmHM6qxwODg1Ausa4vy2Y5UVxHdi7kYwr4rpZGub9rfVb57cZpDDm2QtgLLgx6VYJV0tGi0Bb4fujEmOhDEeJGALIxxUrNaNC8z9CGLeizW5yGwpeX5r/dyFlW9I3jFWrbyrM1+U1w5LjqTrmPvZWDyzxGKurVhstudmzoUJtlsfzCck8hWiUuzrF2v18YjRtrMEVDa2RqM8hjHmaiwILBD0SLGbKhuW02kZH1FX++2W5aZMQX90S3uF1/DClLfeHBGAOAq1aQob0xLDsV1FunY7G8/D2Oo70A4GQaa/k3h/60H/MGtN3LjGscqTEmRmIqGFh5DrRUVk7gAaeflP8A8GLDr8yNKhoWw2hlprC0FKt6VV2/Rj/Q9/8A8mFfwbf5g23/AMX/AN1dXawaZXkRu1O2EGM8HmloLoUFCkM6WaZoZkl2zhqBMVhpe0AW4irIL0GHfy6uCp3W7nZNbGPnrVGfTCn6SPi2G4PmeltppCASSUDifAUzPm2kzmJ0plu8LfymAu37XXKvuBtWvjUq/wAR1i3aLGa0wicbvG2xZQB1U/8A5O7/AEDWg95u0TRCCzFsD8tka+Hg+hIV31VZX7/apt1fOjL6xOkl8ASW+5UR1x+I06+wWHVpBU0SCUHlkfFNLmr09b3hbH4jEUMOF9biCpz6J8K0EszFvsESftn3X5MVBWt50kIT0p5AVAXLvE+66L2t5BgOTVvvzEL4MK4oTSJUeHZn0WdpMrsCSyIzKhkKT+hUDR2fep7V10qKMtHMa3o3ts/NXUqtD4rE0aUMSmg6y5d3wtBqw2u56O3hduazJsS0FbC1r70Y9FaUyr+xbrsIkGIIQjuHb7chwDU3qxWib96lW+1dvgxDDEZCkP7Yrc+5uVgjiaa/k3h/60H/ADBrTGFKuv8AgpaxbGGHJTy/B1YB1Eefeq4WdmFoBEuMXIdlNwwtrggrB3Krt2l36otv9bP91aBMLk/wbQmWn1sLWHQHUcUfxq6vsCZYbO/Of0quOG09wEN99XgK0XgXWHNFouN5mW12S2JUcICcOFW9Y3j74q02aZb5SnZN5lzkFBSG3gkAHnuFRYDU6bpKXpU6O2zNDiuxuFClgNjduppiymU6zbV2mcw+sByHPQWJKPo6rvE1f7IzZRYhGflutLvcXCH3y4Gx3tyau8tECzTZS+DLC1+QrRW1aSsaMQEw7jAYYLQcQ2uMSoBXepFxv9u0ttNtuUuG+xODpOyYKCNRBPxXSRm7SbauPZ0xCp5Cm3DIJGARjIxQ0SZmaO2y2XJ58iI0lDiGHihDuAAQeYq56KuMOxJujHZoM2IgtBCk4aebPFKsVoxZl2S0bGSsOy3nFPyXE8FOKOT7NGLPJtL15MoIxLuDslrHQr2XO2aU3UTYi5trjwHwtoFDK1uFs88+OKs2is23GH2m/wA2Q3EAShhADTZAGACBxq8WrSO8vtRCi2MW5EtLuugr2hQlWRVyYXKtcthvGu6ytCfqQRVz0any9AINoZLYmMhkHkCmvza0n/0yX/UEVo9abrY9BmYDXZhcmQvV2mS3krJqDok8/PauWkk43GU1vaZAwwyfkmr1YoV/h9nnIO46zbiDhbauaTVigX62zFsT57E+3hB2Tq0kPg+ANN2TSKNebq/Amwo7Et8OAOtFwncBU/Ry/wB0a2c+XZpA/bg0vRW/Ys0YyoC4MCay8GmmigpSj5kmtKLLLv7UWCh5DVvW7mb1rQN4SKQhLaAhACUpGAB4CrnZ5MvS+yXJoI2EIPh3n30YH+0h/8QANhEAAgEDAgMGBAQFBQAAAAAAAQIDAAQRBRIhMUETIDAyUGAQIlFxYYGRoRQVYnCxI0JSgJD/2gAIAQIBAT8A/wCgsl7BHzam1aLopNfzf+j96Grr1Wk1OBueRSSpIMoc+xLjU0ThHxP7VNcyzec94EqcioNTkTg/EVDcRzjKH2A8ixqWY4FXd88/yrwXwkdo23KcGrO+E/yvwb/PrzMFBJ5VeXZnb+keICQcirG87ddreYeu6nc5PYr+fet9OkmG48BQ0mLqxp9JH+xv1qaF4W2uO7HI0bB15ioJhMgcetzyiGMuelMxYknu6baiVt7chUsqRLvc8KbV+PypVtqCTnaRg1cwCeMoaIx3dLn2uYj19b1aXgsf597TQBbitWcmQJ9B8FJUgihVxwmf7nuxuUYMOlKwYBh61qL7rg/h3oriWIYRsUzs53Mcn4WNoZn3HyipZFiQu3IU7FmLHr3rB91uvrV0czv9z4Fnam4fHQc6ASJPoBV7eGdsL5R39KOYD9/WroYnf7nwLSEQxBevWtRujI5jXkPA0oYgP39a1BNtw3499MbhmiQBmnOWJ8DT0226+tatH5ZPy8D+HuSnI48BVLEKOtIoRQo6etXUPbRFKI71iqtOob4aiqic7e/pkG+XeeQ9c1K22P2i8j/nvAkHIoanOFxwpmLEk8+8qliFHM1bQCCMJ65JGsilG5Grm2aB9p5dPF0+z7Mdq/P16aFJk2vVzaPbnjy+vhAEnAqy0/Z/qS8/p7AZQw2sMirjS+sP6U8bxnDjHfgsZZumB9TVtZxwcRxP19huiuMMM1Pp0JUsgwfhbWclwCV6UNJk6sKTSUHnbNRWkMXlX2PJp0Dtu5fao4liXagwP7KahLJEiuh60+qSsuFGDSZ2jPP2TewXMzH/AIioYHmbalWiTIm2U59lRW6RFmXr7LeRIxlzik1NRMwby9KilWVdy8vZM0SSKQ4zSWEzLvApPKOGP7KanJtkUoeIq0uC84aVu5Dalxk8BTWS4+U06FDg+xLjTo2VmXzVZ6ehj3SjjQAAwKjCyLs5HpSp84VvrU0zRsFUVcStGAVFXYyivU10kLqjdaBB9dMTBA/Q9yG0BGXprSMjhwqSMxtg/GJhMwDeYfvTZ6UqyA8Tmr8bosZxVzE6ylCdxFaZCoh7Tqcj9PXdPdWzC/I1cWDJxTiKII4GrdQ0gBqZZSw2HhVwsjAdnU8ZdVHWo0SP5RzpwjcGoxdnMB+Irn8LtSyAKOtWulqrdpIOJq7ZWlIQYA9dRijBhzFQyiZAwqW3STmK/g1jbeKYEjAOKVCvXP3+EkSh+1Y4p40nIYHlUsTO6sOnwA3VHHtq8uOxj4cz6/aXJgb8DSsGGVogEYNGH6UYmoowrZ1xWwk5xSxnBoRAUBTP2YzU0zTOWb2BbXbQH6iopklGUPgT3SQjjz+lS3DyPvJqQpIu/keo9go7IcqcVDqR5SCku4X5NQIPL4FlHM097CnXNTai7cE4USTxP/tJ/8QAMREAAgEDAgIJAgcBAQAAAAAAAQIDAAQRITESIAUQMDJBUFFgYSJxExRwgZGhwYCQ/9oACAEDAQE/AP8AgVYXbwoWreJr8r80bU+tG2cUVK7j2JHbltW0pI1TYcxGae3U7aU8bIdfYCqWOBUUITU79kQGGDUsJTUbefAZ0FRRBB89rNFwHI289to9OM8zzqmm9G6b0pbr1FI4cZHKyhhg06lDg+dovEwFAYGOW4k4RgUqljgULX1NSQFBmo3KNnmuUyOLzu1Xdua475q1H0k9RGeqPuDlIyMURg486txhOZo1bcUAAMDqmlCDHjSqWOBQGBjmnGHPnUXcHYSycA+a1Y/NQxcAyd+e57/nUXcHYSvxsTVvHwjiO/YXPf8AOoDmMc526l0HYTnLnzq1bdew448769gTgZonJz51G/AwPPMSEOOq3JKa89w+Fx6+eW8mRwnn/LJmgABgcxIAyakfjbPnisVORUcgcZ7WeXi+kbefI5Q5FRyhxp2c0+fpX2ACRqKjufB6VgwyOd5lSpJWf2GCRtSXD5APVJKse9fml9KN0fAU0rtufY63DgYpmLHJ/RSBVYkGhbKDk0d/ZMLxoPmncIMmpSjHK+ymcsAD7LVS21G3PAMb0ylTg+yUYqcijOgOKO/6KWy5UgjSpYwEIUcl50msB4E1NR9Mvn61GPioZkmQOh09iRzsCAdqlnIbC9UpeNuPdfEenyKlkxC0i+hNWlolwjO7YIqwtEuSwdsYroluCZ4gcikjLgkeHnyyqXMfiOS76VIYrD/NR9K3CnLHNW1wlwnGvXco0Ub8HdIOnpScPF9e1O8DjCpwn75roXSc/b/RUbArnariTMhT0x/fnvSaMuJ03FWvSaSDhk0NAg6ir9yluxFWUlqkbCYZNWElujN+OPtVhcrDJIw7uCQP30qeae4zI2cf0KgeZDxxZ0pbkXFm7+ODn+K7/wB+rol1SZix8P8ARV50sSOCH+asY2SEFzqfPXQOpVtjVxC0EhQ1DdyRbGp755YGQ1GyockZqSdZBqgB+NKB0NW91K0BtkTNQ3EtipjZN6splSGVW8R/h6scf3oaVYWv48mTsPP720Fwmm42pkZCVYa9WKx1ZOMVk4x4UjYBFY6kT8U4FW8CwIEX2Bd2SXAzs3rU0EkLcLjsLazkuDpt61BaxwpwAff5qIPG3Buvgf8AD7BeNZF4XGRU/RAOsR/Y1JYzx7rRUjcdSozbCoujp5PDH3qDoqNNZDk0AAMD/wBpP//Z"'>
            <h5 style="font-size: 0.3125rem;text-align: center;width:4rem;">驾驶证</h5>
          </div>
          <div class="clearBoth"></div>
      </div>
    </div>
    </div>
    <div id="bottomButton">
      <button class="yes" @click="agresRefuse(1)">同意</button>
      <button class="no" @click="agresRefuse(2)">拒绝</button>
      <div class="clearBoth"></div>
    </div>
  </div>
</template>

<script>
  import {androidIos} from "../../js/app";
  import PinchZoom from "../../js/pinchzoom";
  import bridge from "../../js/bridge";
  import {bomb} from "../../js/zujian";
  export default {
      name: "agree-more",
      data(){
          return{
             name:"",
             phone:"",
             IDpic: "",
             Drivepic: "",
             ftpUrl:"",
             refuseResule:"",
          }
      },
      mounted:function () {
         var _this = this ;
         _this.phone = _this.$route.query.ph;
        $.ajax({
          type: "POST",
          url: androidIos.ajaxHttp() + "/driver/findDriverInfo",
          data: JSON.stringify({
            userCode:_this.phone,
            source:sessionStorage.getItem("source")
          }),
          contentType: "application/json;charset=utf-8",
          dataType: "json",
          timeout:30000,
          success: function(findDriverInfo){
            if(findDriverInfo.success == "1"){
              _this.ftpUrl = findDriverInfo.ftpUrl;
              _this.name = findDriverInfo.driverName;
              _this.Drivepic = findDriverInfo.ftpUrl + findDriverInfo.driverLic;
              _this.IDpic = findDriverInfo.ftpUrl + findDriverInfo.idCardPos;
            }else{
              androidIos.second(findDriverInfo.message);
            }
          },
          complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
            if(status=='timeout'){//超时,status还有success,error等值的情况
              androidIos.second("当前状况下网络状态差，请检查网络！")
            }else if(status=="error"){
              androidIos.errorwife();
            }
          }
        });
        $(document).unbind("click").on("click",".label img",function (even) {
          if (even.target.className != "closed" ) {
            var img = $(this).attr("src");
            $("#imgBigbox").remove();
            $("body").append(
              "<div id='imgBigbox'><div class='pinch-zoom'><img id='zoomimg'  src=" +
              img +
              " '></div><div id='zhezhaoImg'></div></div>"
            );
            $("#imgBigbox").css({
              width: "100%",
              height: "100%",
              position: "fixed",
              top: "0",
              left: "0",
              background: "rgb(0,0,0)",
              "z-index": "999",
              display: "block"
            });
            $("#zhezhaoImg").css({
              width: "100%",
              height: "100%",
              position: "absolute",
              background: "rgba(0,0,0,0)",
              "z-index": "999",
              top: "0",
              left: "0"
            });
            $("#imgBigbox img").css({ width: "100%", position: "absolute" });
            var image = document.getElementById("zoomimg");
            image.onload = function() {
              var height = $("#imgBigbox img").height();
              $("div.pinch-zoom").each(function() {
                new PinchZoom($(this), {});
              });
              $(".pinch-zoom-container").css({
                width: "100%",
                height: "100%"
              });
              $("#imgBigbox img").css("top", "50%");
              $(".pinch-zoom").css({ width: "100%", height: "100%" });
              $("#imgBigbox img").css("margin-top", -height / 2 + "px");
              var setImgBox;
              var setImgBoxNumber = 10;
              setImgBox = setInterval(function() {
                setImgBoxNumber--;
                if (setImgBoxNumber < 9) {
                  clearInterval(setImgBox);
                  setImgBoxNumber = 10;
                  $("#zhezhaoImg").remove();
                }
              }, 100);
            };
          }
        });
      },
      methods:{
        agresRefuse:function (type) {
          var _this = this;
          var message = type == 1 ? "同意" : "拒绝" ;
          var http = type == 1 ? "/carrier/acceptApplication" : "/carrier/rejectApplication";
          if(type == 1){
            androidIos.first( "确定" + message + "吗？");
          }else if(type == 2){
            androidIos.third("拒绝理由");
            var refuse = new LArea();
            refuse.init({
              'trigger': '#Z01',
              'valueTo': '#Z01',
              'keys': {
                id: 'id',
                name: 'name'
              },
              'type': 1,
              'data':[{
                "code":"0",
                "region":"无"
              },{
                "code":"1",
                "region":"司机不认识"
              },{
                "code":"2",
                "region":"司机违约次数太多"
              },{
                "code":"3",
                "region":"司机已解除劳动关系"
              }]
            });
            refuse.value = [0];
            refuse.addPointer = function (name) {
              name = JSON.parse(name);
              if(name.firstCode == "0"){
                _this.refuseResule = "";
                $("#Z01").html("请选择拒绝理由");
                $("#Z01").css("color","#999");
              }else{
                _this.refuseResule = name.firstVal;
                $("#Z01").html(name.firstVal);
                $("#Z01").css("color","#333");
              }
            }
          }
          $(".tanBox-yes").unbind('click').click(function() {
            if(type == 2 && _this.refuseResule == ""){
               bomb.first("请选择拒绝理由");
               return false;
            }
            $.ajax({
              type: "POST",
              url: androidIos.ajaxHttp() + http,
              data: JSON.stringify({
                userCode: sessionStorage.getItem("token"),
                source: sessionStorage.getItem("source"),
                pkDriver: _this.$route.query.pkDriver,
                memo:type == 1 ? undefined : _this.refuseResule
              }),
              contentType: "application/json;charset=utf-8",
              dataType: "json",
              timeout: 10000,
              success: function (http) {
                $(".tanBox-bigBox").remove();
                if (http.success == "1") {
                  _this.pdlist.splice(number, 1);
                  _this.$cjj(message + "成功");
                  setTimeout(function () {
                    bridge.invoke("gobackfrom");
                  },500)
                } else {
                  androidIos.second(http.message);
                }
              },
              complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                  androidIos.second("当前状况下网络状态差，请检查网络！")
                } else if (status == "error") {
                  androidIos.errorwife();
                }
              }
            })
          })
        }
      }
    }
</script>

<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
  }
  a {
    color: #42b983;
  }
  #uploadDataT{
    position: fixed;
    left: 0;
    top:1.21875rem;
    bottom:0;
    height: auto;
    overflow-y: scroll;
  }
  .hello {
    background: white;
    border-bottom: 0.03125rem solid #dcdcdc;
  }
  .labelBox {
    width: 100%;
  }
  .companyNameBox {
    line-height: 1rem;
    float: right;
    text-align: right;
    width: 7.7rem;
    font-size: 0.375rem;
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .labelBox p {
    width: 9.68rem;
    padding-left: 0.32rem;
    line-height: 1rem;
    font-size: 0.4rem;
    background: #ececec;
    color: #333;
  }
  .labelBox h1 h5 {
    width: 9.36rem;
    margin-left: 0.32rem;
    padding-right: 0.32rem;
    line-height: 1rem;
    font-size: 0.375rem;
    color: #666;
  }
  .labelBox .label {
    width: 9.36rem;
    margin-left: 0.32rem;
    padding-right: 0.32rem;
    line-height: 1rem;
    height: 1rem;
    font-size: 0.375rem;
    border-bottom: 0.03125rem solid #dcdcdc;
  }
  .labelBox .label span {
    font-size: 0.375rem;
    color: #666;
  }
  .labelBox .label input {
    height: 1rem;
    margin-left: 0.3rem;
    font-size: 0.375rem;
    float: right;
    text-align: right;
    width: 7.3rem;
  }
  .label img{
    width: 4rem;
    height: 2.6rem;
    border: 1px solid #d8d8d8;
  }
  #bottomButton{
      position: fixed;
      bottom: 0;
     left: 0;
     width:100%;
  }
  #bottomButton button{
     width:50%;
    height: 1.2rem;
    color:white;
    float: left;
    font-size: 0.4rem;
  }
  .yes{
    background: #2c9cff;
  }
  .no{
     background: #c7c7c7;
  }
</style>
