
<script>
	import { Label, Checkbox, Button, Input } from "flowbite-svelte";


</script>

<svelte:head>
<title>Login</title>
<meta name="description" content="Ruet Guest House Booking Website" />
</svelte:head>
<div class="mt-[100px]">
    <section class="h-[100vh-100px] flex items-center justify-center">
        <div class="max-w-lg w-[400px] mx-auto px-8 py-8 bg-white rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
          <h2 class="text-2xl font-semibold text-center text-gray-900 dark:text-white">Login</h2>
          <form class="mt-6 space-y-4">
            <div>
              <Label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</Label>
              <Input type="email" id="email" placeholder="name@example.com" required />
            </div>
            <div>
              <Label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</Label>
              <Input type="password" id="password" placeholder="••••••••" required />
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Checkbox id="remember" value="" />
                <Label for="remember" class="ml-2 text-sm text-gray-700 dark:text-gray-500">Remember me</Label>
              </div>
              <a href="/forgot-password" class="text-sm text-blue-700 hover:underline dark:text-blue-500">Forgot password?</a>
            </div>
            <Button type="submit" class="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-md shadow-sm">Sign in</Button>
          </form>
          <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">Don't have an account? <a href="/register" class="text-blue-700 hover:underline dark:text-blue-500">Register</a></p>
        </div>
      </section>
      
</div>