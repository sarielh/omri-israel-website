/* Replace null values with the artist's verified URLs and video files. */
const artist = {
  platforms: {Spotify:null,"Apple Music":null,Deezer:null,TIDAL:null,Instagram:null},
  tracks: [
    {title:"שיר ראשון",links:{}},
    {title:"שיר שני",links:{}},
    {title:"שיר שלישי",links:{}}
  ],
  videos: [
    {title:"רגעים מהבמה",src:null,poster:"assets/images/live-1.webp"},
    {title:"לילה של מוזיקה",src:null,poster:"assets/images/live-2.webp"}
  ],
  bookingEmail:null
};
const shapes = {
 Spotify:'<circle cx="16" cy="16" r="15"/><path d="M7 12q9-4 18 1M8 17q8-3 16 1M10 22q6-2 12 1" fill="none" stroke="#170f1b" stroke-width="2.5" stroke-linecap="round"/>',
 "Apple Music":'<path d="M21 3v18a5 5 0 1 1-3-4V8L10 10v14a5 5 0 1 1-3-4V7z"/>',
 Deezer:'<path d="M2 23h4v6H2zm6-6h4v12H8zm6 3h4v9h-4zm6-12h4v21h-4zm6-6h4v27h-4z"/>',
 TIDAL:'<path d="m1 9 5-5 5 5-5 5zm10 0 5-5 5 5-5 5zm10 0 5-5 5 5-5 5zM11 19l5-5 5 5-5 5z"/>',
 Instagram:'<rect x="4" y="4" width="24" height="24" rx="6" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="24" cy="8" r="1.7"/>'
};
const icon = name => '<svg viewBox="0 0 32 32" aria-hidden="true">'+shapes[name]+'</svg>';
document.querySelectorAll('[data-platforms]').forEach(container=>{
  Object.entries(artist.platforms).forEach(([name,url])=>{
    const a=document.createElement('a');
    a.className='platform';
    a.setAttribute('aria-label',name);
    a.innerHTML=icon(name)+'<span class="platform-label">'+name+'</span>';
    a.href=url||'#platform';
    if(url){a.target='_blank';a.rel='noopener noreferrer'}
    else a.addEventListener('click',event=>{event.preventDefault();showDialog(name,'<p>הקישור הרשמי של האמן יתווסף כאן.</p>')});
    container.append(a);
  });
});
const menu=document.querySelector('.menu');
const nav=document.querySelector('#navigation');
menu.addEventListener('click',()=>{
 const open=menu.getAttribute('aria-expanded')!=='true';
 menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);
});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'){menu.setAttribute('aria-expanded','false');nav.classList.remove('open')}
});
const dialog=document.querySelector('dialog');
const content=document.querySelector('#dialog-content');
function showDialog(title,html){
 document.querySelector('#dialog-title').textContent=title;
 content.innerHTML=html;
 if(!dialog.open)dialog.showModal();
}
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{const video=dialog.querySelector('video');if(video)video.pause();content.innerHTML=''});
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()}});
document.querySelectorAll('[data-song]').forEach(button=>button.addEventListener('click',()=>{
 const track=artist.tracks[Number(button.dataset.song)];
 showDialog(track.title,'<p>בחרו איפה לשמוע</p><div class="platforms" id="track-links"></div>');
 Object.keys(artist.platforms).filter(name=>name!=='Instagram').forEach(name=>{
  const url=track.links[name];
  const a=document.createElement('a');a.className='platform';a.href=url||'#missing';a.innerHTML=icon(name)+name;
  if(url){a.target='_blank';a.rel='noopener noreferrer'}
  else a.addEventListener('click',event=>{event.preventDefault();showDialog(track.title,'<p>כאן יתווסף הקישור לשיר ב־'+name+'.</p>')});
  document.querySelector('#track-links').append(a);
 });
}));
document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>{
 const video=artist.videos[Number(button.dataset.video)];
 showDialog(video.title,video.src?'<video controls autoplay playsinline src="'+video.src+'" poster="'+video.poster+'"></video>':'<img src="'+video.poster+'" alt=""><p>קובץ סרטון ההופעה יתווסף כאן.</p>');
}));
const booking=document.querySelector('[data-booking]');
if(booking&&artist.bookingEmail){booking.href='mailto:'+artist.bookingEmail;booking.textContent=artist.bookingEmail}
const form=document.querySelector('form');
if(form){
 const fields=[...form.querySelectorAll('[required]')];
 function validate(field){
  const error=document.querySelector('#'+field.name+'-error');
  const valid=field.validity.valid;
  error.hidden=valid;field.classList.toggle('field-error',!valid);field.setAttribute('aria-invalid',String(!valid));return valid;
 }
 fields.forEach(field=>field.addEventListener('input',()=>{validate(field);document.querySelector('#form-status').hidden=true}));
 form.addEventListener('submit',event=>{
  event.preventDefault();const invalid=fields.filter(field=>!validate(field));
  if(invalid.length){invalid[0].focus();return}
  const status=document.querySelector('#form-status');status.hidden=false;status.textContent='הפרטים תקינים. יש לחבר שירות שליחת הודעות כדי לשלוח את הפנייה.';status.focus();
 });
}
