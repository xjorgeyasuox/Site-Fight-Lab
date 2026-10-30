import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, reload } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
const config={apiKey:"AIzaSyA0ndrHmH3CJ9ky3dgraW89_W-r8kpAWW4",authDomain:"fightapp-148bc.firebaseapp.com",projectId:"fightapp-148bc",appId:"1:7093476392:web:8a8c0a5293e77dedd7a91d"};
const app=getApps().find(a=>a.name==="onboarding")||initializeApp(config,"onboarding");const auth=getAuth(app);
document.getElementById("save").addEventListener("click",async()=>{
 const feedback=document.getElementById("feedback"),btn=document.getElementById("save");
 const endpoint=document.querySelector('meta[name="fightlab-onboarding-api"]')?.content;
 if(!endpoint||!/^https:\/\//.test(endpoint)){feedback.textContent="Backend ainda não configurado. Seu rascunho permanece salvo neste navegador.";return}
 const email=document.getElementById("email").value.trim(),password=document.getElementById("password").value;
 if(password.length<8){feedback.textContent="Informe uma senha com pelo menos 8 caracteres no cadastro.";return}
 btn.disabled=true;feedback.textContent="Salvando cadastro seguro...";
 try{
  let credential;try{credential=await createUserWithEmailAndPassword(auth,email,password)}
  catch(e){if(e.code!=="auth/email-already-in-use")throw e;credential=await signInWithEmailAndPassword(auth,email,password)}
  await reload(credential.user);if(!credential.user.emailVerified){await sendEmailVerification(credential.user);feedback.textContent="Enviamos um e-mail de verificação. Confirme o endereço e depois clique novamente em SALVAR CONFIGURAÇÃO.";return}const token=await credential.user.getIdToken(true);
  const data=JSON.parse(localStorage.getItem("fightlab:onboarding:v1")||"{}");
  if(!data.name||!data.academy||!data.plan)throw Error("Preencha os dados do cadastro.");
  const response=await fetch(endpoint.replace(/\\/$/,"")+"/onboarding/draft",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},body:JSON.stringify(data)});
  const result=await response.json();if(!response.ok)throw Error(result.error||"Erro ao salvar cadastro");
  feedback.textContent="Cadastro salvo com segurança! A ativação ficará disponível após a integração do pagamento.";
 }catch(e){feedback.textContent=e.message||"Erro ao salvar. Tente novamente."}finally{btn.disabled=false}
});
