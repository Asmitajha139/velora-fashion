import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VELORA | Haute Édition",
  description: "Luxury Fashion & Lifestyle E-Commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <!-- Start Wingify Async V3.0 SmartCode -->
<link rel="preconnect" href="https://edge.wingify.net"/>
<script type="text/javascript">
window._wingify_code || (function() {        
    var account_id = 1288814,
        version = 3.0,
        settings_tolerance = 2000,
        hide_element = 'body',
        hide_element_style =
        'opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;transition:none !important';
    /* DO NOT EDIT BELOW THIS LINE */
    var n=window,i=document;if(-1<i.URL.indexOf('__wingify_disable__')||n._wingify_code)return;var t=!1,r=i.currentScript,nonce=r&&r.nonce,e={sT:settings_tolerance,hES:hide_element_style,hE:hide_element};try{e=Object.assign(e,JSON.parse(localStorage.getItem('_wingify_'+account_id+'_config')))}catch(e){}var code={script:r,nonce:nonce,settings_tolerance:function(){return e.sT},hide_element:function(){return performance.getEntriesByName('first-contentful-paint')[0]?'':e.hE},hide_element_style:function(){return'{'+e.hES+'}'},getVersion:function(){return version},finish:function(){var e;!t&&(t=!0,e=i.getElementById('_vis_opt_path_hides'))&&e.parentNode.removeChild(e)},finished:function(){return t},addScript:function(e){var t=i.createElement('script');t.src=e,nonce&&t.setAttribute('nonce',nonce),t.fetchPriority='high',i.head.appendChild(t)},init:function(){n._settings_timer=setTimeout(function(){code.finish()},this.settings_tolerance());var e,t=this.hide_element();t&&((e=i.createElement('style')).id='_vis_opt_path_hides',nonce&&e.setAttribute('nonce',nonce),e.textContent=t+this.hide_element_style(),i.head.appendChild(e)),this.addScript('https://edge.wingify.net/tag/'+account_id+'.js')}};n._wingify_code=code;code.init();})();
</script> 
<!--End Wingify Async SmartCode -->
      </head>
      <body suppressHydrationWarning className="bg-[#FDFBF7] text-[#121212] antialiased">
        {children}
      </body>
    </html>
  );
}
