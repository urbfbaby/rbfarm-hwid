export function getAdminModals() {
    return `<div class="mo" id="addM"><div class="md"><h3>➕ Add HWID</h3><form method="POST" action="/admin/hwid/add">
<div class="fg"><label>HWID *</label><input name="hwid" required placeholder="Enter HWID"></div>
<div class="fg"><label>Label</label><input name="label" placeholder="e.g. PC Rumah"></div>
<div class="fg"><label>Package</label><select name="package"><option>Lifetime</option><option>Monthly</option><option>Weekly</option><option>Trial</option></select></div>
<div class="fg"><label>User</label><input name="user_name" value="User"></div>
<div class="fg"><label>Email</label><input name="user_email" placeholder="email"></div>
<div class="fg"><label>Expiry</label><input type="datetime-local" name="expired_at"></div>
<div class="ma"><button type="button" class="bc" onclick="closeM('addM')">Cancel</button><button class="bp">Add</button></div>
</form></div></div>

<div class="mo" id="editM"><div class="md"><h3>✏️ Edit</h3><form method="POST" action="/admin/hwid/edit"><input type="hidden" name="id" id="e-id">
<div class="fg"><label>HWID</label><input name="hwid" id="e-hwid" required></div>
<div class="fg"><label>Label</label><input name="label" id="e-label"></div>
<div class="fg"><label>Package</label><select name="package" id="e-pkg"><option>Lifetime</option><option>Monthly</option><option>Weekly</option><option>Trial</option></select></div>
<div class="fg"><label>Status</label><select name="status" id="e-st"><option value="active">Active</option><option value="expired">Expired</option><option value="banned">Banned</option></select></div>
<div class="fg"><label>User</label><input name="user_name" id="e-un"></div>
<div class="fg"><label>Email</label><input name="user_email" id="e-ue"></div>
<div class="fg"><label>Expiry</label><input type="datetime-local" name="expired_at" id="e-exp"></div>
<div class="ma"><button type="button" class="bc" onclick="closeM('editM')">Cancel</button><button class="bp">Save</button></div>
</form></div></div>

<script>
function swTab(t){document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tc').forEach(x=>x.classList.remove('active'));document.getElementById('tab-'+t).classList.add('active');event.target.classList.add('active')}
function closeM(id){document.getElementById(id).classList.remove('show')}
function editH(id,hw,lb,pk,un,ue,ex,st){document.getElementById('e-id').value=id;document.getElementById('e-hwid').value=hw;document.getElementById('e-label').value=lb;document.getElementById('e-pkg').value=pk;document.getElementById('e-st').value=st;document.getElementById('e-un').value=un;document.getElementById('e-ue').value=ue;document.getElementById('e-exp').value=ex;document.getElementById('editM').classList.add('show')}
document.querySelectorAll('.mo').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('show')}));
const p=new URLSearchParams(location.search);
if(p.get('error'))document.getElementById('alerts').innerHTML='<div class="al al-e">'+p.get('error')+'</div>';
if(p.get('success'))document.getElementById('alerts').innerHTML='<div class="al al-s">'+p.get('success')+'</div>';
</script>`;
}
