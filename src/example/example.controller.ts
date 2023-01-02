import { Controller, Get } from "@nestjs/common";

@Controller()
export class ExampleController {
	@Get()
	hello(): string {
		return "this is an example";
	}

}