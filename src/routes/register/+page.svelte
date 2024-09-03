<script>
    import { Button, Checkbox, Input, Label } from 'flowbite-svelte';
    let contact = "";
    let password="";
    let confirmPassword=""
  </script>
  <div class="mt-[100px]">

      <section class="h-[100vh-20px] flex items-center justify-center">
        <div class="max-w-md w-[400px] mx-auto px-8 py-8 bg-white rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
          <h2 class="text-2xl font-semibold text-center text-gray-900 dark:text-white">Register</h2>
          <form class="mt-6 space-y-4">
            <div>
              <Label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</Label>
              <Input type="text" id="name" placeholder="Your Name" required />
            </div>
            <div>
              <Label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</Label>
              <Input type="email" id="email" placeholder="name@example.com" required />
            </div>
            <div>
              <Label for="contact" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact Number</Label>
              <Input type="tel" id="contact" placeholder="01XXXXXXXXX" pattern="^01[3|5|6|7|8|9]{1}[0-9]{8}$" required bind:value={contact} />
              <span class="text-red-500 text-xs"> 
                
                {#if !contact.match(/^01[3|5|6|7|8|9]{1}[0-9]{8}$/)}
                Please enter a valid Bangladeshi phone number (starting with 01 and 8 digits). 
                {/if}
                
               </span>
            </div>
            <div>
              <Label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</Label>
              <Input type="password" id="password" placeholder="••••••••" required  bind:value={password}/>
            </div>
            <div>
              <Label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</Label>
              <Input type="password" id="confirmPassword" placeholder="••••••••" required bind:value={confirmPassword} />
              <span class="text-red-500 text-xs" >

                {#if password!==confirmPassword}
                Passwords must match.
                    
                {/if}
              </span>
            </div>
            <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">Already have an account? <a href="/login" class="text-blue-700 hover:underline dark:text-blue-500">Login</a></p>
            <Button type="submit" class="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-md shadow-sm">Register</Button>
          </form>
        </div>
      </section>
  </div>
  