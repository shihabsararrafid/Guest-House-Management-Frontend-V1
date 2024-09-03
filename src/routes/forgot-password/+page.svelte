<script>

	import { Button, Input, Label } from "flowbite-svelte";

</script>
<div class="mt-[100px]">
    <section class="h-[100vh-100px] flex items-center justify-center">
        <div class="max-w-md w-[400px] mx-auto px-8 py-8 bg-white rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
          <h2 class="text-2xl font-semibold text-center text-gray-900 dark:text-white">Forgot Password</h2>
          <form class="mt-6 space-y-4">
            <div>
              <Label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</Label>
              <Input type="email" id="email" placeholder="name@example.com" required />
            </div>
            <Button type="submit" class="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-md shadow-sm">Send Reset Link</Button>
            <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
              Remember your password? <a href="/login" class="text-blue-700 hover:underline dark:text-blue-500">Login here</a>
            </p>
          </form>
        </div>
      </section>
      
</div>