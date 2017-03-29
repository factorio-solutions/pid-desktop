import React, { Component, PropTypes } from 'react'
import { request } from '../_shared/helpers/request'
import { download } from '../_shared/helpers/download'

import * as nav     from '../_shared/helpers/navigation'
import RoundButton  from '../_shared/components/buttons/RoundButton'

import Swiper from 'swiper'


export default class ReleaseNotesPage extends Component {

  render() {
    const onBack = () => {
      nav.to('/reservations')
    }

    const onClick = () => {
      request((response)=>{console.log(response);}, "mutation GeneratPdf { pdf }")
    }

    const downloadClick = () => {
      download ('HelloKity.pdf', "download { invoice }")
    }

    const onSIPClick = () => {
      request((response)=>{console.log(response);}, `mutation CallNumber{ gate(number: "${document.getElementById('tel').value}" ) }`)
    }

    const generateClick = () => {
      request((response)=>{console.log(response);}, "mutation GeneratInvoices { generate_invoices }")
    }
    const resetPasswordClick = () => {
      request((response)=>{console.log(response);}, "query ($email:String!) { reset_password(email:$email) }", { email: 'notExisting@seznam.cz'})
    }
    const callPaypal = () => {
      request((response)=>{console.log(response);}, "mutation PaypalReqiest { paypal_payment }")
    }

    return (
      <div style={{padding: "15px"}}>
        <h3>Test zone</h3>
        {/* Generate PDF button ================================================*/}
        {/* <button onClick={onClick}>Generate PDF</button> */}
        {/* <button onClick={downloadClick}>Download PDF</button> */}
        <button onClick={generateClick}>Generate invoices</button>
        {/* <button onClick={resetPasswordClick}>Reset passeword</button> */}
        <button onClick={callPaypal}>PayPal API call</button>


        {/* Release notes ======================================================*/}

        {/*<button onClick={onSIPClick}>Make a SIP call</button> <input type="tel" id="tel" />*/}
        {/* <br/>*/}

        <h2>Go back</h2>
        <div>
          <RoundButton content={<span className="fa fa-chevron-left" aria-hidden="true"></span>} onClick={onBack}/>
        </div>

        <h2>Release notes</h2>
        <h3>r20170314a</h3>
        <ul>
          <li>V každém formuláři přidána feature: při kliknutí na šedé OK tlačítko se zvýrazní nevyplněná pole formuláře.</li>
        </ul>

        <h3>r20170310a</h3>
        <ul>
          <li>Oprava všemožných bugů na trellu</li>
          <li>Optimalizace newReservation rychlosti načítání</li>
          <li>Spojení s novým API dokončeno až na případné bugy, </li>
        </ul>

        <h3>r20170216a</h3>
        <ul>
          <li>Zprovoznění stránky pro zakládání a správu accountů</li>
          <li>Zprovoznění 'Add features' stránky</li>
          <li>Zprovoznění Occupancy overview stránky</li>
          <li>Upraveno vertikální menu, zobrazuje pouze položky, ke kterým má uživatel přístup</li>
        </ul>

        <h3>r20170213a</h3>
        <ul>
          <li><b>Pozměněná koncepce PID - nová specifikace a pojetí</b></li>
          <li>Od základu předěláno API aplikace</li>
        </ul>
        <ul>
          <li>Na stránce "Garages" předěláno vytváření nové garáže, přidána nová komponenta GarageLayout, zařazeny Gates do tvorby garáže</li>
          <li>Na stránce "Garages" přidána vztváření a editace pricing (cena rezervace) a rent (cena nájmu místa)</li>
          <li>Na stránce "Garages" předělána stránka managementu garáže, nová logika přidělování míst k clientům, rents, places a gates</li>
        </ul>
        <ul>
          <li>Stránka "Clients" spojena s novým API</li>
        </ul>
        <ul>
          <li>Stránka "Users" spojena s novým API</li>
          <li>Stránka "Invite users" nyní slouží pro pozvání nových uživatelů do garáže, clienta nebo auta</li>
        </ul>
        <ul>
          <li>Přibyla nová stránka "Cars" pro management aut uživatelů systému</li>
        </ul>
        <ul>
          <li>Stránka "Reservations" spojena s novým API</li>
          <li>Na stránce "New Reservations" přibyl modul placení a výběru klienta, po vybrání parametrů rezervace je uživatel poslán na stránku s přehledem rezervace, odkud je možné rezervaci zrovna zaplatit.</li>
        </ul>

        <h3> r20161221a </h3>
        <ul>
          <li>Vytvořen Selenium webdriver test pro zrychlení procesu testování stránky </li>
          <li>Login uživatele nyní obsluhuje server server</li>
        </ul>
        <ul>
          <li>Na stránce "Users > Invite new user" je nyní možné pozvat několik uživatelů najednou zadáním více emailů oddělených čárkou </li>
        </ul>
        <ul>
          <li>Na stránce "Occupancy overview" se nyní v rezervaci zobrazuje jméno uživatele, kterému patří rezervace</li>
        </ul>
        <ul>
          <li>Na stránce "Garages" přidána možnost přejití na marketing garáže</li>
          <li>Na stránce "Garages > Edit Garage/Setup New Garage" pole GPS (kam se vyplňovalo "Lat: ..., Lng: ...") vyměněno za dvě pole Latitude a Longitude </li>
          <li>Na stránce "Garages > Edit Garage/Setup New Garage" se po vyplnění adresy automaticky vyplní pole Latitude a Longitude (geocoding pro potřeby marketingu)</li>
        </ul>
        <ul>
          <li>Na stránce "Garages > Marketing" existuje možnost vytvoření nového marketingu, editace/spuštění/pozastavení existujících marketingů</li>
          <li>Na stránce "Garages > New marketing" byl vytvořen formulář pro zadání short_name, kontaktů, popisu garáže, vlastností garáže a vložení obrázků garáže </li>
          <li>Na stránce "[url]/marketing/[short_name] (subdomény bude možné dělat až budeme mít vlastní doménu)" se vygeneruje marketingová stránka dané garáže s headerem PID, velkým carouselem (swipable myší nebo prstem), údaji zadnými do "New marketing" formuláře a mapou zobrazující lokaci určenou políčky Latitude a Longitude</li>
        </ul>

        <h3> r20161130a </h3>
        <ul>
          <li>Komponenta Table byla přepsána tak, aby byla méně náchylná na chyby kódu </li>
          <li>Přidáno logování budgů do heroku </li>
          <li>Změněn vzhed invitation emailu, zatím bez obrázků </li>
        </ul>
        <ul>
          <li>Vytvořeny komponenty Card a CardViewLayout pro Card View, na stránkách "Garages", "Reservations" a "Notifications" přidány přepínače card a table view (pro každou stránku vytvořena zvláštní kartička zděděná od Card componenty)</li>
        </ul>

        <h3> r20161125a </h3>
        <ul>
          <li>Na stránce "Users" Řádky tabulky zešediví, pokud je user pending</li>
          <li>Na stránce "Users" Přidáno tlačítko vedoucí na stránku invite User, kde uživatel může přizvat dalšího člověka do svého účtu, pokud uživatel ještě neexistuje, zašle se mu mail s odkazem na stránky s předvyplněným registračním formulářem </li>
        </ul>
        <ul>
          <li>Na stránce "Occupacny" a "Notifications" nová filtrační menu v pravém horním rohu</li>
        </ul>
        <ul>
          <li>Rezervace již nejsou mazány, ale jsou zneplatňovány, to umožní zobrazovat jejich historii</li>
          <li>[FIX] Opravena chyba, kdy i uživatelé, kteří nejsou správci účtu mohli přidávat další lidi </li>
          <li>[FIX] Occupancy overview se překreslí když dojde ke změně velikosti okna (předtím to vedlo na nesprávnou pozici ukazatele aktuálního času) </li>
        </ul>

        <h3> r20161121a </h3>
        <ul>
          <li>Vertikální menu zmenší velikost tlačítek, pokud je jich příliš, Menu je možné zasunout </li>
          <li>Na stránce "Occupacny" a "Notifications" nová filtrační menu v pravém horním rohu</li>
          <li>Na stránce "Users" Řádky tabulky zešediví, pokud je user pending</li>
        </ul>

        <h3> r20161118a </h3>
        <ul>
          <li>Úprava komponenty Table, umožňuje přidání čárkované čáry mezi záznam a detail </li>
        </ul>
        <ul>
          <li>Na stránce "Notifications" Filtr notifikací přesunut do pravého horního rohu</li>
        </ul>
        <ul>
          <li>Na stánce "Garage () > Accounts" Existuje možnost vytvořit vazbu accountPlace do nekončena, pro tento účel přibylo v datepickeru tlačítko </li>
        </ul>
        <ul>
          <li>Na stánce "Occupancy overview" Optimalizace komponenty OccupancyOverview (stejná funkčnost, nižší výpočetní náročnost) </li>
        </ul>
        <ul>
          <li>[Fix] Při odhlášení uživatele zůstávala data v úložišti, dalšímu uživateli se občas mohli načíst - vyřešeno smazáním obsahu Redux Storu při odhlášení </li>
          <li>[Fix] Nově vytvořená rezervace se neoběvovala v Occupancy overview - opraveno </li>
        </ul>

        <h3> r20161116a </h3>
        <ul>
          <li>Vytvořena nová komponenta OccupancyOverview</li>
          <li>Zlepšení procesu při statusu 401 (uživatel nemá právo)</li>
          <li>Zlepšený systém notifikací, nyní umožňuje vkládat do zprávy jména (např jméno accountu při pozvání)</li>
          <li>Úprava designu datepickeru, vertical menu (spodní části)</li>
        </ul>
        <ul>
          <li>Přidána nová stránka Occupancy, na ní přidána umístěna komponenta OccupancyOverview, zobrazuje rezervace v dané garáži, časovou osu je možné posouvat šipkami ve spodní části, rezervace je možné filtrovat Account selectorem</li>
        </ul>
        <ul>
          <li>Na stánce "Garages" Zpřístupněna editace garáže a occupancy overview</li>
          <li>Na stánce "Garages () > Edit garage" je nyní možné editovat informace o garáži. Při změnšení počtu míst jsou smazána vazby accountPlace, na které již nevyšlo místo. Rezervace takovéhoto místa jsou zrušeny, uživatelé jsou následně informováni</li>
        </ul>
        <ul>
          <li>Na stánce "Notifications" je nyní možné zobrazit notifikace z minulosti</li>
        </ul>

        <h3> r20161114a </h3>
        <ul>
          <li>Vytvořeny nové komponenty: DatePicker, TimePicker, DateTimePicker, DateInput a DatetimeInput</li>
        </ul>
        <ul>
          <li>Na stánce "Reservations > New Reservation" byly vloženy nové komponenty pro výběr data, byla upravena logika stránky tak, aby byla s kompatibilní s novými komponentami</li>
        </ul>
        <ul>
          <li>Na stánce "Garages () > Accounts" byly vloženy datepickery od, do. Umožňují vytvoření vazby AccountPlace na určitou dobu. To má vliv na dostupná místa při vytváření rezervace</li>
        </ul>

        <h3> r20161109a </h3>
        <ul>
          <li>Stránka "Notifications" je stále dostupná (tlačítko se podbarví modře, pokud je počet notifikací nenulový)</li>
          <li>Na stránce "Reservation" přidán sloupeček Garage</li>
          <li>Na stránce "Client accounts () > Users" při vybrání konkrétního uživatele tlačitko Remove nemizí, ale je disabled, pokud nejde použít (např. account admin)</li>
          <li>Na stránce "Garages > New Garage" je možné při tvorbě jednotlivého patra zadat jen rozsah parkovacích míst (schema patra je automaticky vygenerováno)</li>
          <li>Na stránce "Garages () > Accounts" při odebrání místa z konkrétního accountu jsou všechny budoucí rezervace na toto místo zrušeny (parkující jsou informováni pomocí notifikace)</li>
          <li>Na stránce "Client accounts" přidána možnost editace konkrétního accountu</li>
          <li>Na stránce "Client accounts () > Users" při odebrání uživatele z konkrétního accountu jsou všechny budoucí rezervace tohoto uživatele zrušeny (uživatel je informováni pomocí notifikace)</li>
          <li>Na stránce "Users" dojde při kliknutí na jméno accountu k přechodu přímo do nastavení tohoto accountu</li>
          <li>[ui] Výchozí akci formuláře (odeslání) je možné vyvolat stiskem klávesy Enter (login, sign-up, newAccount a newAccounUser)</li>
          <li>[ui] Jméno vybrané garáže nebo accountu přesunuto do drobečkové navigace</li>
          <li>[ui] Při zobrazení SVG garáže se schema garáže zarovnává vlevo nahoru</li>
          <li>[i18n] Naimportován soubor s překlady 20161109 (parser doplní chybějící překlady jejich klíčem)</li>
          <li>[Fix] Při změně dostupnosti místa při vytváření nebo editaci rezervace dojde k automatickému vybrání nového místa</li>
          <li>[Fix][i18n] Opraven odkaz na klíč pageBase.newAccountUsersHint</li>
        </ul>

        <h3> r20161107a </h3>
        <ul>
          <li>Na stránku "Garage" přidán sloupeček Places</li>
          <li>Na stránku "Garage () > Accounts" přidán sloupeček Places</li>
          <li>Na stránku "Client accounts" přidán sloupeček Users s počtem uživatelů</li>
          <li>Nová stránka "Users"</li>
          <li>[i18n] Možnost nastavit na stránce "Profile settings" jazyk aplikace</li>
        </ul>

        <h3> r20161104a </h3>
        <ul>
          <li>Initial release</li>
        </ul>
      </div>
    );
  }
}
