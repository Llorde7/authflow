import { createClient } from '@/utils/supabase/server'


export default async function test(){
  
  const supabase = createClient();
  const {data: {user}} = await supabase.auth.getUser();

  if(!user){
    console.log('No user logged in')
    return;
  }
  const { data, error } = await supabase
    .from('expenses')
    .select('amount, payment_date')
    .eq('user_id',user.id)

  if(error){
    console.log(error)
  } else {
    console.log(data)
  }

  

  return <div>test working</div>
}