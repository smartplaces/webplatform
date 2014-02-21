if (Beacons.find().count()===0){
  Beacons.insert({
    uuid:"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
    major:Math.round(Math.random()*65535),
    minor:Math.round(Math.random()*65535),
    tags: ['Tag1','Tag2']
  });

  Beacons.insert({
    uuid:"5A4BCFCE-174E-4BAC-A814-092E77F6B7E5",
    major:Math.round(Math.random()*65535),
    minor:Math.round(Math.random()*65535),
    tags: ['Tag1','Tag3']
  });

  Beacons.insert({
    uuid:"74278BDA-B644-4520-8F0C-720EAF059935",
    major:Math.round(Math.random()*65535),
    minor:Math.round(Math.random()*65535),
    tags: []
  });
}

if (Locations.find().count()===0){
  Locations.insert({
    title: 'Кавказский филиал ОАО МегаФон',
    address: 'Россия, г. Краснодар, ул. Лузана, 40',
    contacts: 'тел. 555-777',
    lat:45.068747,
    lng:38.984167
  });

  Locations.insert({
    title: 'Кинотеатр Аврора',
    address: 'Россия, г. Краснодар, ул. Красная, 169',
    contacts: 'тел. 555-555',
    lat:45.058047,
    lng:38.982538
  });

  Locations.insert({
    title: 'ТЦ Галерея',
    address: 'Россия, г. Краснодар, ул. В. Головатого, 313',
    contacts: 'тел. 555-888',
    lat:45.039734,
    lng:38.974705
  });

}

if (Tags.find().count()===0){
  Tags.insert({name:'Sample'});
  Tags.insert({name:'Shop'});
  Tags.insert({name:'POS'});
}
